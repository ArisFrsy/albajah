'use client'

import { useState, useEffect } from 'react'

interface EditPaketModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { idPaket: number; nama: string; deskripsi?: string }) => void
    data: {
        idPaket: number
        nama: string
        deskripsi?: string | null
    } | null
}

export default function EditPaketModal({
    isOpen,
    onClose,
    onSubmit,
    data,
}: EditPaketModalProps) {
    const [nama, setNama] = useState('')
    const [deskripsi, setDeskripsi] = useState('')

    useEffect(() => {
        if (data) {
            setNama(data.nama || '')
            setDeskripsi(data.deskripsi || '')
        }
    }, [data])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!data) return
        onSubmit({
            idPaket: data.idPaket,
            nama,
            deskripsi,
        })
        onClose()
    }

    if (!isOpen || !data) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Edit Paket</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Paket</label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
