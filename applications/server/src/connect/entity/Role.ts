import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.ts";
import type { Permission } from "./Permission.ts";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @Column({ comment: "角色" })
  role: string;

  @OneToMany("Permission", (permission: Permission) => permission.role)
  permissions: Permission[];

  @Column({ comment: "角色描述" })
  description: string;

  @Column({ comment: "创建时间" })
  createAt: Date = new Date();
}
