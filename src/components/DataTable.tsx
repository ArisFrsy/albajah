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

            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden shadow-sm">
                <thead className="bg-indigo-50 text-sky-700">
                    <tr className="*:font-semibold *:text-sm *:px-4 *:py-3">
                        <th className="text-left">Name</th>
                        <th className="text-left">DoB</th>
                        <th className="text-left">Role</th>
                        <th className="text-left">Salary</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((item, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}
                        >
                            <td className="px-4 py-2 text-gray-800 font-medium">{item.name}</td>
                            <td className="px-4 py-2 text-gray-600">{item.dob}</td>
                            <td className="px-4 py-2 text-gray-600">{item.role}</td>
                            <td className="px-4 py-2 text-gray-600">{item.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="row">
                <div className="col-span-12 mt-4">
                    <div className="mb-4 flex justify-between items-center">
                        {/* Left side: Showing x–y of z and dropdown */}
                        <div className="flex items-center">
                            <span className="text-gray-700">
                                Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, data.length)} of {data.length}
                            </span>
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value))
                                    setPage(1) // reset to first page
                                }}
                                className="border rounded p-1 text-sm text-gray-700 ml-4"
                            >
                                <option value={3}>3 per page</option>
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                            </select>
                        </div>

                        {/* Right side: Pagination */}
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
                </div>
            </div>

        </>
    )
}
