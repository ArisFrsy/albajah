'use client'

import React, { useMemo } from 'react'
import { File } from 'lucide-react'


export type Header<T> = {
    column: keyof T | string
    label: string
    orderable?: boolean
    align?: 'left' | 'right' | 'center'
    render?: (_row: T) => React.ReactNode
}

type DataTableProps<T> = {
    data: T[]
    headers: Header<T>[]
    page: number
    perPage: number
    setPage: (_page: number) => void
    setPerPage: (_perPage: number) => void
    orderBy?: string | null
    order?: 'asc' | 'desc'
    setOrderBy?: (_column: string | null) => void
    setOrder?: (_order: 'asc' | 'desc') => void
    totalPages?: number
}

// Helper to access nested values like 'paket.nama'
function getNestedValue(obj: any // eslint-disable-line @typescript-eslint/no-explicit-any
    , path: string): any // eslint-disable-line @typescript-eslint/no-explicit-any 
{
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

function DataTable<T extends Record<string, any // eslint-disable-line @typescript-eslint/no-explicit-any
>>({
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
    totalPages = 1,
}: DataTableProps<T>) {

    const sortedData = useMemo(() => {
        if (!orderBy) return data

        return [...data].sort((a, b) => {
            const aVal = getNestedValue(a, orderBy)
            const bVal = getNestedValue(b, orderBy)

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

            return order === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal))
        })
    }, [data, orderBy, order])

    const paginatedData = useMemo(() => {
        return sortedData
    }, [sortedData])

    const handleSort = (col: string) => {
        if (!setOrderBy || !setOrder) return

        if (orderBy === col) {
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
                                className={`text-${align} ${orderable ? 'cursor-pointer' : ''}`}
                                onClick={() => orderable && handleSort(String(column))}
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
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, idx) => (
                            <tr
                                key={idx}
                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}
                            >
                                {headers.map(({ column, render, align = 'left' }) => (
                                    <td
                                        key={String(column)}
                                        className={`px-4 py-2 text-${align} text-gray-800`}
                                    >
                                        {render
                                            ? render(row)
                                            : column === 'no'
                                                ? (page - 1) * perPage + idx + 1
                                                : String(getNestedValue(row, String(column)) ?? '')
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length}>
                                <div className="h-[250px] flex flex-col items-center justify-center text-gray-500 text-sm">
                                    <File className="w-10 h-10 mb-2" />
                                    There is no data
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

            <div className="mt-4 flex justify-between items-center text-sm">
                <div>
                    <span className="text-gray-600">
                        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, data.length)} of {data.length}
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="mr-2 text-gray-700">Rows per page</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                setPerPage(Number(e.target.value))
                                setPage(1)
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

                    <span className="text-gray-700">
                        Page {page} of {totalPages === 0 ? 1 : totalPages}
                    </span>

                    <div className="flex items-center">
                        <button
                            onClick={() => handlePageChange(1)}
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
