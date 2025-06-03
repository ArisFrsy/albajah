'use client';

import { useEffect, useState } from 'react';
import { SubPaket } from '@/models/SubPaket';
import { Paket } from '@/models/Paket';
import { usePaketPagination } from '../../master-paket/UsePaketPagination';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { formatCurrency, unformatCurrency } from '@/utils/formatCurrency';
import { Minus, Plus } from 'lucide-react';
import { confirmDialog } from '@/lib/confirm-dialog';
import { toast } from 'sonner';


function InsertSubPaketPage() {
    const router = useRouter();
    const [namaSubPaket, setNamaSubPaket] = useState('');
    const [idPaket, setIdPaket] = useState('');
    const [hargaIDR, setHargaIDR] = useState(0);
    const [hargaUSD, setHargaUSD] = useState(0);
    const [keberangkatan, setKeberangkatan] = useState('');
    const [durasiHari, setDurasiHari] = useState(0);
    const [penerbangan, setPenerbangan] = useState('');
    const [hotelMekkah, setHotelMekkah] = useState('');
    const [hotelMadinah, setHotelMadinah] = useState('');
    const [fasilitas, setFasilitas] = useState('');
    const [perlengkapan, setPerlengkapan] = useState('');
    const [hargaIDRDisplay, setHargaIDRDisplay] = useState('');
    const [hargaUSDDisplay, setHargaUSDDisplay] = useState('');
    const [fasilitasList, setFasilitasList] = useState<string[]>(['']);
    const [perlengkapanList, setPerlengkapanList] = useState<string[]>(['']);


    const [paketList, setPaketList] = useState<Paket[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { paket, setSearch, loading } = usePaketPagination(1, 1000);

    useEffect(() => {
        if (paket.length > 0) {
            setPaketList(paket);
            const paketOptions = paket.map((p) => ({
                value: p.idPaket,
                label: p.nama,
            }));

            setOptions(paketOptions);

        }
    }, [paket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const confirmed = await confirmDialog({
            title: 'Konfirmasi',
            description: 'Apakah Anda yakin ingin menambahkan sub paket ini?',
            confirmText: 'Ya, Tambah',
            cancelText: 'Batal',
        });
        if (!confirmed.confirmed) return;

        const newSubPaket: SubPaket = {
            idSubpaket: '',
            idPaket: parseInt(idPaket),
            namaSubPaket,
            hargaIDR,
            hargaUSD,
            keberangkatan: new Date(keberangkatan).toISOString(),
            durasiHari,
            penerbangan,
            hotelMekkah,
            hotelMadinah,
            fasilitas: fasilitasList.filter(f => f.trim() !== '').join(', '),
            perlengkapan: perlengkapanList.filter(p => p.trim() !== '').join(', '),
        };

        try {
            const response = await fetch('/api/master/sub-paket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newSubPaket),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || 'Gagal menambahkan sub paket');
            }

            toast.success('Sub paket berhasil ditambahkan');

            router.push('/master-subpaket');
        } catch (err) {
            toast.error('Terjadi kesalahan saat menambahkan sub paket');
        }
    };

    const resetForm = () => {
        setNamaSubPaket('');
        setIdPaket('');
        setHargaIDR(0);
        setHargaUSD(0);
        setKeberangkatan('');
        setDurasiHari(0);
        setPenerbangan('');
        setHotelMekkah('');
        setHotelMadinah('');
        setFasilitas('');
        setPerlengkapan('');
        setFasilitasList(['']);
        setPerlengkapanList(['']);

    };

    if (!isClient) return <Loading />;


    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Tambah Sub Paket</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="space-y-2">
                                <Label>Nama Sub Paket</Label>
                                <Input value={namaSubPaket} onChange={(e) => setNamaSubPaket(e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Pilih Paket</Label>
                                <Combobox
                                    items={options}
                                    value={idPaket}
                                    onChange={(item) => setIdPaket(item.value.toString())}
                                    placeholder="Cari paket..."
                                />

                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Harga IDR</Label>
                                <Input
                                    value={hargaIDRDisplay}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const numeric = unformatCurrency(value);
                                        setHargaIDR(numeric);
                                        setHargaIDRDisplay(formatCurrency(numeric, 'id-ID', 'IDR'));
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Harga USD</Label>
                                <Input
                                    value={hargaUSDDisplay}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const numeric = unformatCurrency(value);
                                        setHargaUSD(numeric);
                                        setHargaUSDDisplay(formatCurrency(numeric, 'en-US', 'USD'));
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Durasi Hari</Label>
                                <Input type="number" value={durasiHari} onChange={(e) => setDurasiHari(Number(e.target.value))} required />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className="space-y-2">
                                <Label>Keberangkatan</Label>
                                <Input type="date" value={keberangkatan} onChange={(e) => setKeberangkatan(e.target.value)} required />
                            </div>


                            <div className="space-y-2">
                                <Label>Penerbangan</Label>
                                <Input value={penerbangan} onChange={(e) => setPenerbangan(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hotel Mekkah</Label>
                                <Input value={hotelMekkah} onChange={(e) => setHotelMekkah(e.target.value)} required />
                            </div>

                            <div className="space-y-2">
                                <Label>Hotel Madinah</Label>
                                <Input value={hotelMadinah} onChange={(e) => setHotelMadinah(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Fasilitas</Label>
                            {fasilitasList.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => {
                                            const updated = [...fasilitasList];
                                            updated[index] = e.target.value;
                                            setFasilitasList(updated);
                                        }}
                                        placeholder={`Fasilitas ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            const updated = fasilitasList.filter((_, i) => i !== index);
                                            setFasilitasList(updated.length ? updated : ['']);
                                        }}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    {index === fasilitasList.length - 1 && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setFasilitasList([...fasilitasList, ''])}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>


                        <div className="space-y-2">
                            <Label>Perlengkapan</Label>
                            {perlengkapanList.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => {
                                            const updated = [...perlengkapanList];
                                            updated[index] = e.target.value;
                                            setPerlengkapanList(updated);
                                        }}
                                        placeholder={`Perlengkapan ${index + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            const updated = perlengkapanList.filter((_, i) => i !== index);
                                            setPerlengkapanList(updated.length ? updated : ['']);
                                        }}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    {index === perlengkapanList.length - 1 && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setPerlengkapanList([...perlengkapanList, ''])}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>


                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={resetForm}>
                                Reset
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                Simpan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {loading && <Loading />}
        </main>
    );
}

export default withAuth(InsertSubPaketPage);
