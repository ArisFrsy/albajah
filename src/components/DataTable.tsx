'use client'

import React, { useState } from 'react'

const data = [
    { name: 'Nandor the Relentless', dob: '04/06/1262', role: 'Vampire Warrior', salary: '$0' },
    { name: 'Laszlo Cravensworth', dob: '19/10/1678', role: 'Vampire Gentleman', salary: '$0' },
    { name: 'Nadja', dob: '15/03/1593', role: 'Vampire Seductress', salary: '$0' },
    { name: 'Colin Robinson', dob: '01/09/1971', role: 'Energy Vampire', salary: '$53,000' },
    { name: 'Guillermo de la Cruz', dob: '18/11/1991', role: 'Familiar/Vampire Hunter', salary: '$0' },
    { name: 'Baron Afanas', dob: '11/08/1100', role: 'Ancient Vampire', salary: '$0' },
    { name: 'Simon the Devious', dob: '23/07/1400', role: 'Rival Vampire', salary: '$0' },
]

export const DataTable = () => {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(3)

    const totalPages = Math.ceil(data.length / perPage)

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage)
        }
    }

    const paginatedData = data.slice((page - 1) * perPage, page * perPage)

    return (
        <>
            <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-700">
                    Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, data.length)} of {data.length}
                </span>
                <select
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(Number(e.target.value))
                        setPage(1) // reset to first page
                    }}
                    className="border rounded p-1 text-sm"
                >
                    <option value={3}>3 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                </select>
            </div>

            <table className="min-w-full divide-y-2 divide-gray-200">
                <thead className="ltr:text-left rtl:text-right">
                    <tr className="*:font-medium *:text-gray-900">
                        <th className="px-3 py-2 whitespace-nowrap">Name</th>
                        <th className="px-3 py-2 whitespace-nowrap">DoB</th>
                        <th className="px-3 py-2 whitespace-nowrap">Role</th>
                        <th className="px-3 py-2 whitespace-nowrap">Salary</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((item, index) => (
                        <tr key={index} className="*:text-gray-900 *:first:font-medium">
                            <td className="px-3 py-2 whitespace-nowrap">{item.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{item.dob}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{item.role}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{item.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ul className="flex justify-center gap-1 mt-4 text-gray-900">
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
        </>
    )
}
