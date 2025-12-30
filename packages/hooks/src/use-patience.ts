/**
 * 表示异步操作的结果类型
 * @template T - 成功时返回的数据类型
 * @type {[success: boolean, data: T | null, error: unknown | null]} - 三元组表示的异步结果
 *   - 当操作成功时: [true, data, null]
 *   - 当操作失败时: [false, null, error]
 */
export type Patience<T = unknown> = [true, T, null] | [false, null, Error];

/**
 * 将Promise包装成具有统一返回格式的异步结果
 * @template T - Promise成功时返回的数据类型
 * @param {Promise<T>} value - 要处理的Promise对象
 * @returns {Promise<Patience<T>>} - 包装后的Promise，始终解析为统一的三元组格式
 * @example
 * const [success, data, error] = await usePatience(fetchData());
 * if (success) {
 *   console.log('数据获取成功:', data);
 * } else {
 *   console.error('数据获取失败:', error);
 * }
 */
export function usePatience<T = unknown>(
  value: Promise<T>,
): Promise<Patience<T>> {
  return new Promise<Patience<T>>((resolve) => {
    value
      .then((val) => resolve([true, val, null]))
      .catch((err) => resolve([false, null, err]));
  });
}
