import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~ui/table";
import React, { useState } from "react";
import { FullLoading } from "../features/full-loading";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data?: TData[];
  isPending?: boolean;
  empty?: React.ReactNode;
}

export function BrandTable<TData>({
  columns,
  data = [],
  isPending = false,
  empty = null,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        {rows?.length !== 0 && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody>
          {rows?.length
            ? rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : empty && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    {empty}
                  </TableCell>
                </TableRow>
              )}
          {isPending && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <FullLoading />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
