import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from '@tanstack/react-table';

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  rowSelection,
  setRowSelection,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (updater: (old: PaginationState) => PaginationState) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: (updater: (old: RowSelectionState) => RowSelectionState) => void;
}) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: onPaginationChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  // Добавляем чекбоксы в колонки внутри table
  // (Логика отображения добавлена в header и cell ниже)
  // ...
  return (
    <div className="rounded-md border border-zinc-200">
      <table className="w-full text-sm">
        <thead className="bg-zinc-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {/* Колонки чекбоксов */}
              {setRowSelection && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                </th>
              )}
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-4 text-left font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-200 hover:bg-zinc-50">
              {setRowSelection && (
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </td>
              )}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t border-zinc-200 flex items-center justify-between">
        <div className="text-xs text-zinc-500">
          Страница {table.getState().pagination.pageIndex + 1} из {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="border rounded px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Назад
          </button>
          <button
            className="border rounded px-2 py-1 text-xs hover:bg-zinc-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}
