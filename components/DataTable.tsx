import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const DataTable = <T extends { id: string }>(
  { columns, data }: DataTableProps<T>
) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-secondary">
          <tr>
            {/* <th scope="col" className="py-3 px-4 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </th> */}
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length > 0 ? data.map((item) => (
            <tr key={item.id} className="border-b border-border-color last:border-b-0 hover:bg-secondary">
               {/* <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
               </td> */}
              {columns.map((col, index) => (
                <td key={index} className="px-4 py-3 whitespace-nowrap text-text-secondary">
                  <span className="text-text-primary">
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
                  </span>
                </td>
              ))}
            </tr>
          )) : (
              <tr>
                  <td colSpan={columns.length + 1} className="text-center py-10 text-text-secondary">
                      No data available.
                  </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;