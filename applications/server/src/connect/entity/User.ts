import "reflect-metadata";
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

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

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];

  @Column({ comment: "创建时间" })
  createAt: Date = new Date();
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.permissions)
  user: User;

  @Column({ comment: "权限" })
  permission: string;
}
