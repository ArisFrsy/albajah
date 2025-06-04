'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cabang } from '@/models/Cabang'; // Pastikan path model sudah benar

interface DetailCabangModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Cabang | null;
}

// Helper component untuk merender setiap baris detail secara konsisten
function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
    if (!value) return null; // Jangan render jika value tidak ada
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="mt-1 text-base text-foreground">{value}</div>
        </div>
    );
}

export default function DetailCabangModal({ isOpen, onClose, data }: DetailCabangModalProps) {
    if (!data) return null; // Jika tidak ada data, jangan render dialog

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Detail Cabang</DialogTitle>
                    <DialogDescription>
                        Detail informasi kontak dan lokasi cabang.
                    </DialogDescription>
                </DialogHeader>

                {/* Menggunakan Grid untuk layout yang rapi dan konsisten */}
                <div className="grid gap-y-5 py-4">
                    <DetailItem label="Provinsi" value={data.provinces?.name || '-'} />
                    <DetailItem label="Kabupaten/Kota" value={data.regencies?.name || '-'} />
                    <DetailItem label="Penanggung Jawab" value={data.penanggungjawab || '-'} />
                    <DetailItem
                        label="Email"
                        value={
                            data.email ? (
                                <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                                    {data.email}
                                </a>
                            ) : (
                                '-'
                            )
                        }
                    />
                    <DetailItem
                        label="No. Telepon"
                        value={
                            data.noTelepon ? (
                                <a href={`tel:${data.noTelepon}`} className="text-blue-600 hover:underline">
                                    {data.noTelepon}
                                </a>
                            ) : (
                                '-'
                            )
                        }
                    />
                </div>

                {/* Menggunakan DialogFooter agar tombol selalu di bawah */}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}