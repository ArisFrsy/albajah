'use client'

import React from 'react'

interface DetailPaketModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        nama: string
        deskripsi?: string | null
    } | null
}

export default function DetailPaketModal({
    isOpen,
    onClose,
    data,
}: DetailPaketModalProps) {
    if (!isOpen || !data) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Detail Paket</h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Nama Paket</p>
                        <p className="text-base font-medium text-gray-900">{data.nama}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Deskripsi</p>
                        <p className="text-base text-gray-800">
                            {data.deskripsi || '-'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}
