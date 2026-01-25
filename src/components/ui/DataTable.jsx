import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Download, ChevronUp, ChevronDown, MoreVertical } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  downloadable = false,
  responsive = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isMobile, setIsMobile] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile && responsive) {
        // Di mobile, tampilkan hanya 2-3 kolom utama
        const importantColumns = columns.filter(col => !col.hideOnMobile).slice(0, 3);
        setVisibleColumns(importantColumns);
      } else {
        setVisibleColumns(columns);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [columns, responsive]);

  // Filter data
  const filteredData = data.filter(row =>
    columns.some(col =>
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Table Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          {searchable && (
            <div className="relative max-w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari data..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition text-sm">
            <Filter size={16} className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          
          {downloadable && (
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition text-sm">
              <Download size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {isMobile && responsive && (
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreVertical size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      {!isMobile ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate">{column.label}</span>
                      {column.sortable && (
                        <div className="flex items-center justify-center ml-2">
                          <div className="p-1.5 bg-blue-100 rounded-md">
                            {sortConfig.key === column.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp size={14} className="text-blue-700 font-bold" strokeWidth={3} />
                              ) : (
                                <ChevronDown size={14} className="text-blue-700 font-bold" strokeWidth={3} />
                              )
                            ) : (
                              <ChevronUp size={14} className="text-blue-500" strokeWidth={2.5} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  {visibleColumns.map((column) => (
                    <td key={column.key} className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mobile Cards View */
        <div className="p-3 space-y-3">
          {paginatedData.map((row, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                {visibleColumns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between">
                    <span className="text-xs font-medium text-gray-500">{column.label}:</span>
                    <span className="text-sm text-gray-900 text-right">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-gray-700 text-center sm:text-left">
          Menampilkan {startIndex + 1} sampai {Math.min(startIndex + pageSize, sortedData.length)} dari {sortedData.length} data
        </div>
        
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(3, totalPages))].map((_, i) => {
              const pageNum = currentPage <= 2 
                ? i + 1 
                : currentPage >= totalPages - 1 
                  ? totalPages - 2 + i 
                  : currentPage - 1 + i;
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition text-sm ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            {totalPages > 3 && currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition text-sm ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {totalPages}
              </button>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};