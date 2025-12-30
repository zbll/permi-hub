import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * 请求日志表
 */
@Entity()
export class Log {
  @PrimaryColumn()
  id: string;

  @Column({ comment: "请求路径" })
  url: string;

  @Column({ comment: "请求方法" })
  method: string;

  @Column({ type: "json", comment: "请求参数" })
  params: string;

  @Column({ comment: "请求IP" })
  requestIp: string;

  @Column({ comment: "是否安全请求" })
  isSecure: boolean;

  @Column({ comment: "请求语言" })
  language: string;

  @Column({ comment: "用户代理" })
  userAgent: string;

  @Column({ type: "json", comment: "请求头" })
  headers: Record<string, string>;

  @Column({ type: "json", comment: "返回结果" })
  response: string;

  @Column({ comment: "是否成功" })
  isSuccess: boolean;

  @Column({ type: "text", comment: "失败原因" })
  reason: string;

  @Column({ comment: "创建时间" })
  createAt: Date = new Date();
}
