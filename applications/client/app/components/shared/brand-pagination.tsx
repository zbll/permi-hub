import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Label } from "../ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";

// 分页组件的属性接口
export interface BrandPaginationProps {
  current: number; // 当前页码
  page: number; // 每页显示的项目数
  total: number; // 总项目数
  maxView?: number; // 最多显示的页码数量，默认为5
  onPageChange?: (current: number, page: number) => void; // 页码改变时的回调函数
}

export function BrandPagination({
  current,
  page,
  total,
  maxView = 5,
  onPageChange,
}: BrandPaginationProps) {
  const { t } = useTranslation();
  const nextPage = t(Locale.Text$NextPage);
  const previousPage = t(Locale.Text$PreviousPage);

  // 上一页处理函数
  const handlePrev = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (current === 1) return; // 如果已经是第一页，则不执行操作
    onPageChange?.(current - 1, page);
  };

  // 下一页处理函数
  const handleNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (current === Math.ceil(total / page)) return; // 如果已经是最后一页，则不执行操作
    onPageChange?.(current + 1, page);
  };

  // 计算总页数
  const maxPage = Math.ceil(total / page);

  // 计算分页显示的页码，最小为 1，最大为 maxPage
  const viewData: number[] = [];

  // 计算页码显示逻辑
  if (maxPage <= maxView) {
    // 如果总页数小于等于最大显示页数，显示所有页码
    for (let i = 1; i <= maxPage; i++) {
      viewData.push(i);
    }
  } else {
    // 如果总页数大于最大显示页数，需要计算显示哪些页码
    const halfMaxView = Math.floor(maxView / 2);
    let startPage, endPage;

    if (current - halfMaxView <= 1) {
      // 如果当前页靠近开头，从第一页开始显示
      startPage = 1;
      endPage = maxView;
    } else if (current + halfMaxView >= maxPage) {
      // 如果当前页靠近末尾，显示到总页数结束
      startPage = maxPage - maxView + 1;
      endPage = maxPage;
    } else {
      // 当前页在中间位置，以当前页为中心显示页码
      startPage = current - halfMaxView;
      endPage = current + halfMaxView;
    }

    // 生成页码数组
    for (let i = startPage; i <= endPage; i++) {
      viewData.push(i);
    }
  }

  const isFirstPage = current === 1; // 是否为第一页
  const isEndPage = current === maxPage; // 是否为最后一页

  // 是否显示前省略号（当前显示的页码不包含第一页时）
  const showPrevEllipsis = viewData.length > 0 && viewData[0] > 1;
  // 是否显示后省略号（当前显示的页码不包含最后一页时）
  const showNextEllipsis =
    viewData.length > 0 && viewData[viewData.length - 1] < maxPage;

  return (
    <>
      <div className="hidden lg:flex items-center gap-2">
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          {t(Locale.Text$RowsPerPage)}
        </Label>
        <Select
          value={page.toString()}
          onValueChange={(value) => {
            onPageChange?.(1, Number(value));
          }}
        >
          <SelectTrigger size="sm" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Pagination className="justify-end w-auto mx-0">
        <PaginationContent>
          {/* 如果不是第一页，显示上一页按钮 */}
          {isFirstPage ? null : (
            <PaginationItem>
              <PaginationPrevious href="#" onClick={handlePrev}>
                {previousPage}
              </PaginationPrevious>
            </PaginationItem>
          )}

          {/* 如果需要，显示前省略号 */}
          {showPrevEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* 渲染页码 */}
          {viewData.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={current === pageNum} // 当前页码高亮显示
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPageChange?.(pageNum, page);
                }}
                href="#"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 如果需要，显示后省略号 */}
          {showNextEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* 如果不是最后一页，显示下一页按钮 */}
          {isEndPage ? null : (
            <PaginationItem>
              <PaginationNext href="#" onClick={handleNext}>
                {nextPage}
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
