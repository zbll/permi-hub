import { usePatience } from "@packages/hooks";
import { Permissions } from "@packages/types";
import { AppDataSource } from "~data-source";
import { Permission } from "~entity/Permission.ts";
import { In, Not } from "typeorm";

export class PermissionService {
  static fromIds(ids: number[]) {
    return usePatience(
      AppDataSource.manager.find(Permission, {
        where: {
          id: In(ids),
        },
      }),
    );
  }

  static list() {
    return usePatience(
      AppDataSource.manager.find(Permission, {
        where: { permission: Not(Permissions.Admin) },
      }),
    );
  }

  static #isInit = false;

  static #Admin = (() => {
    const admin = new Permission();
    admin.permission = Permissions.Admin;
    return admin;
  })();

  static async init() {
    if (this.#isInit) return;
    this.#isInit = true;
    const admin = await AppDataSource.manager.findOne(Permission, {
      where: {
        permission: Permissions.Admin,
      },
    });
    if (admin === null) {
      const newAdmin = await AppDataSource.manager.save(this.#Admin);
      this.#Admin = newAdmin;
    } else {
      this.#Admin = admin;
    }
  }

  static getAdmin() {
    return this.#Admin;
  }
}
