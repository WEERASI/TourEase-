// components/admin/DataTable.tsx
// Reusable data table with sorting, pagination, search, and action buttons

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Search, Inbox } from 'lucide-react';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    searchValue?: string;
    isLoading?: boolean;
    emptyMessage?: string;
    actions?: (item: T) => React.ReactNode;
}

function DataTable<T extends Record<string, any>>({
    columns,
    data,
    pageSize = 10,
    searchPlaceholder = 'Search...',
    onSearch,
    searchValue,
    isLoading = false,
    emptyMessage = 'No data found',
    actions,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [localSearch, setLocalSearch] = useState('');

    // Search filtering (local if no onSearch prop)
    const filteredData = useMemo(() => {
        if (onSearch || !localSearch) return data;
        const q = localSearch.toLowerCase();
        return data.filter((item) =>
            Object.values(item).some((val) =>
                String(val).toLowerCase().includes(q)
            )
        );
    }, [data, localSearch, onSearch]);

    // Sorting
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const compare = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
            return sortDir === 'asc' ? compare : -compare;
        });
    }, [filteredData, sortKey, sortDir]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const handleSearch = (value: string) => {
        setLocalSearch(value);
        setCurrentPage(1);
        onSearch?.(value);
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-64" />
                </div>
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 flex gap-4">
                            {columns.map((_, j) => (
                                <div key={j} className="h-5 bg-slate-100 rounded animate-pulse flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Search bar */}
            <div className="p-4 border-b border-slate-100">
                <div className="relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue !== undefined ? searchValue : localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/80">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.header}
                                        {col.sortable !== false && (
                                            <ArrowUpDown size={13} className={sortKey === col.key ? 'text-sky-500' : 'text-slate-300'} />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center text-slate-400">
                                        <Inbox size={40} className="mb-3" />
                                        <p className="text-sm font-medium">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, idx) => (
                                <tr key={item._id || item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3.5 text-sm text-slate-700">
                                            {col.render ? col.render(item) : item[col.key] ?? '—'}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {actions(item)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {sortedData.length > pageSize && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600">
                            <ChevronsLeft size={16} />
                        </button>
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-slate-600">
                            {currentPage} / {totalPages}
                        </span>
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600">
                            <ChevronRight size={16} />
                        </button>
                        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600">
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
