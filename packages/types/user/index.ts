/**
 * 性别
 */
export type Gender = "male" | "female";

/**
 * 用户
 */
export type User = {
  /**
   * 用户ID
   */
  id: number;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 创建时间
   */
  createAt: number;
};
