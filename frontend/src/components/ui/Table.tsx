import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function Table<T>({ 
  data, 
  columns, 
  className, 
  onRowClick, 
  loading = false,
  emptyMessage = "Nenhum dado encontrado" 
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-gray-500">
        <p className="text-sm leading-5">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto border border-gray-200 rounded-lg', className)}>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider leading-4',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors duration-150'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 leading-5"
                  >
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden">
        <div className="space-y-3 p-4">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'bg-white border border-gray-200 rounded-lg p-4 space-y-2',
                onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors duration-150'
              )}
            >
              {columns
                .filter(column => !column.hideOnMobile)
                .map((column) => (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.header}
                    </span>
                    <div className="text-sm text-gray-900 text-right flex-1 ml-4">
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Table; 