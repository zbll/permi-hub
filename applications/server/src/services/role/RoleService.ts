import { AppDataSource } from "~data-source";
import { Role } from "~entity/Role.ts";
import { Permission } from "~entity/Permission.ts";
import { usePatience, type Patience } from "@packages/hooks";
import { Permissions } from "@packages/types";
import { PermissionService } from "../permission/PermissionService.ts";
import { In, Not } from "typeorm";

export class RoleService {
  static add(role: string, permissions: Permission[], desc: string) {
    const roleEntity = new Role();
    roleEntity.role = role;
    roleEntity.permissions = permissions;
    roleEntity.description = desc;
    return usePatience(AppDataSource.manager.save(roleEntity));
  }

  static get(id: number) {
    return usePatience(
      AppDataSource.manager.findOneOrFail(Role, {
        where: { id },
        relations: { permissions: true },
      }),
    );
  }

  static delete(id: number) {
    return usePatience(AppDataSource.manager.delete(Role, { id }));
  }

  static edit(role: Role) {
    return usePatience(AppDataSource.manager.save(role));
  }

  static list() {
    return usePatience(
      AppDataSource.manager.find(Role, {
        where: {
          id: Not(this.#Admin.id),
        },
        relations: {
          permissions: true,
        },
      }),
    );
  }

  static async getWithPermissions(
    id: number,
  ): Promise<Patience<{ data: Role; permissions: Permission[] }>> {
    const [success, data, error] = await this.get(id);
    if (!success) return [success, null, error];
    return [true, { data, permissions: data.permissions }, null];
  }

  static getRolesFromIds(id: number[]) {
    return usePatience(
      AppDataSource.manager.find(Role, {
        where: {
          id: In(id),
        },
      }),
    );
  }

  static #isInit = false;
  static #Admin: Role = new Role();

  static async init() {
    if (this.#isInit) return;
    this.#isInit = true;
    await PermissionService.init();
    const admin = await AppDataSource.manager.findOne(Role, {
      where: {
        role: Permissions.Admin,
      },
    });
    if (admin === null) {
      const admin = new Role();
      admin.role = Permissions.Admin;
      admin.permissions = [PermissionService.getAdmin()];
      admin.description = Permissions.Admin;
      const newAdmin = await AppDataSource.manager.save(admin);
      this.#Admin = newAdmin;
    } else {
      this.#Admin = admin;
    }
  }

  static getAdmin() {
    return this.#Admin;
  }
}
