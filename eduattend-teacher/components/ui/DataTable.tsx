import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    px-5 py-3
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  {column.header}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td
                  colSpan={columns.length}
                  className="
                    px-5 py-10
                    text-center
                    text-sm
                    text-slate-400
                  "
                >
                  {emptyMessage}
                </td>
              </tr>

            ) : (

              data.map((item, index) => (

                <tr
                  key={index}
                  className="
                    border-b
                    border-slate-100
                    last:border-0
                    hover:bg-slate-50
                  "
                >

                  {columns.map((column) => (

                    <td
                      key={column.key}
                      className="
                        px-5
                        py-3
                        text-sm
                        text-slate-600
                      "
                    >
                      {column.render(item, index)}
                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}