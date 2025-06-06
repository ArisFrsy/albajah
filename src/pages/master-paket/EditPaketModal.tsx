'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface EditPaketModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (_data: { idPaket: number; nama: string; deskripsi?: string; fileFoto?: File | null }) => void
    data: {
        idPaket: number
        nama: string
        deskripsi?: string | null
        pathFoto?: string | null
    } | null
}

export default function EditPaketModal({ isOpen, onClose, onSubmit, data }: EditPaketModalProps) {
    const [nama, setNama] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        if (data) {
            setNama(data.nama || '')
            setDeskripsi(data.deskripsi || '')
            setFile(null)
        }
    }, [data])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        } else {
            setFile(null)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!data) return
        onSubmit({
            idPaket: data.idPaket,
            nama,
            deskripsi,
            fileFoto: file || null,
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Paket</DialogTitle>
                </DialogHeader>
                {data && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Paket</Label>
                            <Input
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">Upload Gambar</Label>
                            <Input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {data.pathFoto && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">Gambar saat ini:</p>
                                    <Image
                                        src={data.pathFoto}
                                        alt="Foto Paket"
                                        width={100}
                                        height={100}
                                        className="rounded-md border border-gray-300 mt-1"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Batal
                            </Button>
                            <Button type="submit">
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
