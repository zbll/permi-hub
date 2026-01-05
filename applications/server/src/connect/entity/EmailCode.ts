import "reflect-metadata";
import { Entity, Column, PrimaryColumn } from "typeorm";

export enum EmailCodeStatus {
  Pending = "pending",
  Sent = "sent",
  Failed = "failed",
}

/**
 * 邮箱验证码表
 */
@Entity()
export class EmailCode {
  @PrimaryColumn()
  id: string = crypto.randomUUID();

  @Column({ comment: "邮箱", unique: true, nullable: false })
  email: string;

  @Column({ comment: "验证码", nullable: false })
  code: string;

  @Column({ comment: "创建时间", nullable: false })
  createAt: Date = new Date();

  @Column({ comment: "到期时间", nullable: false })
  expireAt: Date;

  @Column({
    type: "enum",
    comment: "发送状态",
    enum: EmailCodeStatus,
    default: EmailCodeStatus.Pending,
  })
  status: EmailCodeStatus = EmailCodeStatus.Pending;
}
