import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role.ts";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "权限" })
  permission: string;

  @ManyToOne(() => Role, (role) => role.permissions, {
    onDelete: "CASCADE",
  })
  role: Role;

  @Column({ comment: "创建时间" })
  createAt: Date = new Date();
}
