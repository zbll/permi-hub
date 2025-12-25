export class ServiceUtils {
  static getSortParam(sort: string | undefined) {
    if (sort === undefined) return undefined;
    const value = sort.toUpperCase();
    if (value === "ASC") return "ASC";
    if (value === "DESC") return "DESC";
    if (value === "1") return "ASC";
    if (value === "-1") return "DESC";
    return undefined;
  }
}
