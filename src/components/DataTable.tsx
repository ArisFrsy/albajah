'use client'

import React, { useState, useMemo } from 'react'
import { Header } from './Header'

type DataTableProps<T> = {
    data: T[]
    headers: Header<T>[]
    page: number
    perPage: number
    setPage: (page: number) => void
    setPerPage: (perPage: number) => void
    orderBy?: keyof T | null
    order?: 'asc' | 'desc'
    setOrderBy?: (column: keyof T | null) => void
    setOrder?: (order: 'asc' | 'desc') => void
}

function DataTable<T extends Record<string, any>>({
    data,
    headers,
    page,
    perPage,
    setPage,
    setPerPage,
    orderBy = null,
    order = 'asc',
    setOrderBy,
    setOrder,
}: DataTableProps<T>) {
    const totalPages = Math.ceil(data.length / perPage)

    // Sorting logic
    const sortedData = useMemo(() => {
        if (!orderBy) return data

        const sorted = [...data].sort((a, b) => {
            const aVal = a[orderBy]
            const bVal = b[orderBy]

            if (aVal == null) return 1
            if (bVal == null) return -1

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return order === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal)
            }

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return order === 'asc' ? aVal - bVal : bVal - aVal
            }

            // fallback string comparison
            return order === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal))
        })

        return sorted
    }, [data, orderBy, order])

    const paginatedData = useMemo(() => {
        return sortedData.slice((page - 1) * perPage, page * perPage)
    }, [sortedData, page, perPage])

    const handleSort = (col: keyof T) => {
        if (!setOrderBy || !setOrder) return

        if (orderBy === col) {
            // toggle asc/desc
            setOrder(order === 'asc' ? 'desc' : 'asc')
        } else {
            setOrderBy(col)
            setOrder('asc')
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    return (
        <>
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden shadow-sm table-auto md:table-fixed">
                <thead className="bg-green-50 text-zinc-700">
                    <tr className="*:font-semibold *:text-sm *:px-4 *:py-3">
                        {headers.map(({ column, label, orderable, align = 'left' }) => (
                            <th
                                key={String(column)}
                                className={`text-${align} cursor-${orderable ? 'pointer' : 'default'}`}
                                onClick={() => orderable && typeof column === 'string' && handleSort(column)}
                                style={{ userSelect: orderable ? 'none' : 'auto' }}
                            >
                                <div className="flex items-center gap-1 select-none">
                                    {label}
                                    {orderable && orderBy === column && (
                                        <span>{order === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((row, idx) => (
                        <tr
                            key={idx}
                            className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}
                        >
                            {headers.map(({ column, render, align = 'left' }) => (
                                <td
                                    key={String(column)}
                                    className={`px-4 py-2 text-${align} text-gray-800`}
                                >
                                    {render ? render(row) : String(row[column as keyof T])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center text-sm">
                {/* Left section: Information like "Showing X-Y of Z" or "X row(s) selected" */}
                <div>
                    <span className="text-gray-600"> {/* Adjusted text color to be slightly lighter as in image example */}
                        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, data.length)} of {data.length}
                    </span>
                </div>

                {/* Right section: All pagination controls */}
                <div className="flex items-center space-x-4"> {/* Controls spacing between "Rows per page", "Page X of Y", and buttons */}
                    {/* Rows per page dropdown */}
                    <div className="flex items-center">
                        <span className="mr-2 text-gray-700">Rows per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value));
                                setPage(1); // Reset to first page when items per page changes
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        >
                            {[10, 25, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Page X of Y display */}
                    <span className="text-gray-700">
                        Page {page} of {totalPages === 0 ? 1 : totalPages} {/* Handles case where totalPages might be 0 */}
                    </span>

                    {/* Navigation Buttons: Styled to be text-like and close together */}
                    <div className="flex items-center"> {/* Container for tight grouping of navigation buttons */}
                        <button
                            onClick={() => handlePageChange(1)} // Assuming handlePageChange can navigate to a specific page number
                            disabled={page === 1 || totalPages === 0}
                            className="px-2 py-1 text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            aria-label="First page"
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || totalPages === 0}
                            className="px-2 py-1 text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            aria-label="Previous page"
                        >
                            &lt;
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages || totalPages === 0}
                            className="px-2 py-1 text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            aria-label="Next page"
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={page === totalPages || totalPages === 0}
                            className="px-2 py-1 text-gray-700 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                            aria-label="Last page"
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DataTable
