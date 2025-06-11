'use client'

import React from 'react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DetailPaketModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        nama: string
        deskripsi?: string | null
        pathFoto?: string | null
        urlFoto?: string | null
    } | null
}

// Komponen untuk menampilkan setiap baris detail
// Membantu agar kode utama lebih bersih dan konsisten
function DetailItem({ label, value }: { label: string; value: string | React.ReactNode }) {
    if (!value) return null
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="mt-1 text-base text-foreground">{value}</div>
        </div>
    )
}

export default function DetailPaketModal({ isOpen, onClose, data }: DetailPaketModalProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    if (!data) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Paket</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai paket yang dipilih.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-y-6 py-4">
                    <DetailItem label="Nama Paket" value={data.nama} />
                    <DetailItem
                        label="Deskripsi"
                        value={
                            <p className="whitespace-pre-wrap">
                                {data.deskripsi || '-'}
                            </p>
                        }
                    />

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Foto Paket</p>
                        <div className="mt-2">
                            {data.urlFoto ? (
                                <a
                                    href={baseUrl + data.urlFoto}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative aspect-video w-full rounded-lg overflow-hidden border group"
                                    title="Klik untuk melihat gambar penuh"
                                >
                                    <Image
                                        src={baseUrl + data.urlFoto}
                                        alt={`Foto untuk ${data.nama}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            ) : (
                                <div className="flex items-center justify-center aspect-video w-full rounded-lg border border-dashed">
                                    <p className="text-sm text-muted-foreground">Tidak ada gambar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}