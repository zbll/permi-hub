import "reflect-metadata";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import type { Role } from "./Role.ts";

/**
 * 用户表
 */
@Entity()
export class User {
  @PrimaryColumn()
  id: string = crypto.randomUUID();

  @Column({ comment: "昵称" })
  nickname: string;

  @Column({ comment: "邮箱" })
  email: string;

  @Column({ comment: "密码" })
  password: string;

  @Column({ comment: "IP地址" })
  ip: string;

  @OneToMany("Role", (role: Role) => role.user)
  roles: Role[];

  @Column({ comment: "创建时间" })
  createAt: Date = new Date();

  @Column({ comment: "最后登录时间", nullable: true })
  lastLoginAt?: Date;
}
