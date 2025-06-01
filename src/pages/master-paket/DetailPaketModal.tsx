'use client'

import React from 'react'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DetailPaketModalProps {
    isOpen: boolean
    onClose: () => void
    data: {
        nama: string
        deskripsi?: string | null
        pathFoto?: string | null
    } | null
}

export default function DetailPaketModal({ isOpen, onClose, data }: DetailPaketModalProps) {
    const handlePreview = () => {
        if (data?.pathFoto) {
            window.open(data.pathFoto, '_blank')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Paket</DialogTitle>
                </DialogHeader>

                {data && (
                    <ScrollArea className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nama Paket</p>
                            <p className="text-base text-gray-800 px-1">
                                {data.nama}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">Deskripsi</p>
                            <p className="text-base text-gray-800 ">
                                {data.deskripsi || '-'}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Foto Paket</p>
                                {data.pathFoto && (
                                    <Button
                                        variant="link"
                                        className="text-indigo-600 hover:text-indigo-800 p-0 h-auto"
                                        onClick={handlePreview}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Lihat
                                    </Button>
                                )}
                            </div>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden mt-2 border">
                                <Image
                                    src={data.pathFoto || '/images/no-image.png'}
                                    alt="Foto Paket"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={onClose}>Tutup</Button>
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}
