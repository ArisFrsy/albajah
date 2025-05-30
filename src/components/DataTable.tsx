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
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden shadow-sm">
                <thead className="bg-indigo-50 text-sky-700">
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

            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="text-gray-700">
                        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, data.length)} of {data.length}
                    </span>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value))
                            setPage(1) // reset to first page
                        }}
                        className="border rounded p-1 text-sm text-gray-700 ml-4"
                    >
                        {[10, 25, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n} per page
                            </option>
                        ))}
                    </select>
                </div>

                <ul className="flex gap-1 text-gray-900">
                    <li>
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-50"
                            aria-label="Previous page"
                        >
                            ←
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => handlePageChange(i + 1)}
                                className={`block size-8 rounded text-center text-sm/8 font-medium ${page === i + 1
                                    ? 'bg-indigo-600 border border-indigo-600 text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-50"
                            aria-label="Next page"
                        >
                            →
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default DataTable
