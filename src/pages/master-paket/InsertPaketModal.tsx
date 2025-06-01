'use client'

import { useState } from 'react'
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

interface InsertPaketModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { nama: string; deskripsi?: string; fileFoto: File | null }) => void
}

export default function InsertPaketModal({ isOpen, onClose, onSubmit }: InsertPaketModalProps) {
    const [nama, setNama] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        } else {
            setFile(null)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ nama, deskripsi, fileFoto: file || null })
        setNama('')
        setDeskripsi('')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Paket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Paket</Label>
                        <Input
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            placeholder="Masukkan nama paket"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows={3}
                            placeholder="Opsional"
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
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
