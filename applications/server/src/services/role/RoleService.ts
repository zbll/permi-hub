import { AppDataSource } from "~data-source";
import { Role } from "~entity/Role.ts";
import { Permission } from "~entity/Permission.ts";
import { usePatience } from "@packages/hooks";
import { Permissions } from "@packages/types";
import { PermissionService } from "../permission/PermissionService.ts";

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
      AppDataSource.manager.findOneOrFail(Role, { where: { id } }),
    );
  }

  static delete(id: number) {
    return usePatience(AppDataSource.manager.delete(Role, { id }));
  }

  static edit(role: Role) {
    return usePatience(AppDataSource.manager.save(role));
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
