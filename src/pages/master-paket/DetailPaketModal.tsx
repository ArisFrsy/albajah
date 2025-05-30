'use client'

import React from 'react'
import Image from 'next/image'
import { Eye } from 'lucide-react'

interface DetailPaketModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        nama: string
        deskripsi?: string | null
        pathFoto?: string | null
    } | null
}

export default function DetailPaketModal({
    isOpen,
    onClose,
    data,
}: DetailPaketModalProps) {
    if (!isOpen || !data) return null

    const handlePreview = () => {
        if (data.pathFoto) {
            window.open(data.pathFoto, '_blank')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Detail Paket</h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Nama Paket</p>
                        <p className="text-base font-medium text-gray-900 p-2">{data.nama}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Deskripsi</p>
                        <p className="text-base text-gray-800 p-2">
                            {data.deskripsi || '-'}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Foto Paket</p>
                            {data.pathFoto && (
                                <button
                                    onClick={handlePreview}
                                    className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                                    title="Lihat Gambar Penuh"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Lihat
                                </button>
                            )}
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden p-2 mt-2">
                            <Image
                                src={data.pathFoto || '/images/no-image.png'}
                                alt="Foto Paket"
                                fill
                                className="object-cover"
                            />
                        </div>
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
