'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cabang } from '@/models/Cabang';

interface DetailCabangModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Cabang | null;
}
export default function DetailCabangModal({ isOpen, onClose, data }: DetailCabangModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Cabang</DialogTitle>
                </DialogHeader>

                {data && (
                    <ScrollArea className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">Provinsi</p>
                            <p className="text-base text-gray-800">
                                {data.provinces?.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">Kabupaten/Kota</p>
                            <p className="text-base text-gray-800">
                                {data.regencies?.name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">Penanggung Jawab</p>
                            <p className="text-base text-gray-800">
                                {data.penanggungjawab || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">Email</p>
                            <p className="text-base text-gray-800">
                                {data.email || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mnt-1">No Telepon</p>
                            <p className="text-base text-gray-800">
                                {data.noTelepon || '-'}
                            </p>
                        </div>

                    </ScrollArea>
                )}

                <Button variant="outline" onClick={onClose} className="mt-4 w-full">
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
}