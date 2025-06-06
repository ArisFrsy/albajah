'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

import { usePaketPagination } from '../../master-paket/UsePaketPagination';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { SubPaket } from '@/models/SubPaket';
import { decrypt } from '@/lib/Encrypt';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency, unformatCurrency } from '@/utils/formatCurrency';
import { confirmDialog } from '@/lib/confirm-dialog';


// Skema validasi Zod (sama persis dengan halaman tambah)
const formSchema = z.object({
    namaSubPaket: z.string().min(3, { message: 'Nama sub paket harus diisi (min. 3 karakter).' }),
    idPaket: z.string().min(1, { message: 'Paket harus dipilih.' }),
    hargaIDR: z.coerce.number().min(0, { message: 'Harga IDR tidak boleh negatif.' }),
    hargaUSD: z.coerce.number().min(0, { message: 'Harga USD tidak boleh negatif.' }),
    keberangkatan: z.string().min(1, { message: 'Tanggal keberangkatan harus diisi.' }),
    durasiHari: z.coerce.number().min(1, { message: 'Durasi harus diisi (min. 1 hari).' }),
    penerbangan: z.string().min(3, { message: 'Informasi penerbangan harus diisi.' }),
    hotelMekkah: z.string().min(3, { message: 'Informasi hotel Mekkah harus diisi.' }),
    hotelMadinah: z.string().min(3, { message: 'Informasi hotel Madinah harus diisi.' }),
    fasilitas: z.string().optional(),
    perlengkapan: z.string().optional(),
});

function EditSubPaketPage() {
    const router = useRouter();
    const params = useParams();
    const decryptId = params?.id as string;
    const id = decryptId ? decrypt(decryptId) : '';
    const [isClient, setIsClient] = useState(false);
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
    const [fasilitasList, setFasilitasList] = useState<string[]>([]);
    const [perlengkapanList, setPerlengkapanList] = useState<string[]>([]);
    const [hargaIDR, setHargaIDR] = useState(0);
    const [hargaUSD, setHargaUSD] = useState(0);
    const [hargaIDRDisplay, setHargaIDRDisplay] = useState('');
    const [hargaUSDDisplay, setHargaUSDDisplay] = useState('');

    // State loading untuk proses fetch data awal
    const [initialLoading, setInitialLoading] = useState(true);

    const { paket, loading: paketLoading } = usePaketPagination();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { // Nilai default kosong, akan diisi oleh data dari API
            namaSubPaket: '',
            idPaket: '',
        },
    });

    // Efek untuk mengambil data paket (untuk combobox)
    useEffect(() => {
        if (paket.length > 0) {
            const paketOptions = paket.map((p) => ({
                value: p.idPaket,
                label: p.nama,
            }));
            setOptions(paketOptions);
        }
    }, [paket]);

    // 1. Efek untuk mengambil data sub-paket yang akan diedit
    useEffect(() => {
        if (id) {
            try {
                setInitialLoading(true);
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (!data.data) throw new Error("Data tidak ditemukan");
                        const p: SubPaket = data.data;

                        // 2. Gunakan `form.reset()` untuk mengisi seluruh form dengan data dari API
                        form.reset({
                            namaSubPaket: p.namaSubPaket || '',
                            idPaket: p.idPaket?.toString() || '',
                            hargaIDR: p.hargaIDR || 0,
                            hargaUSD: p.hargaUSD || 0,
                            keberangkatan: p.keberangkatan?.split('T')[0] || '', // Format YYYY-MM-DD
                            durasiHari: p.durasiHari || 0,
                            penerbangan: p.penerbangan || '',
                            hotelMekkah: p.hotelMekkah || '',
                            hotelMadinah: p.hotelMadinah || '',
                            fasilitas: p.fasilitas || '',
                            perlengkapan: p.perlengkapan || '',
                        });
                        setHargaIDR(p.hargaIDR || 0);
                        setHargaUSD(p.hargaUSD || 0);
                        setHargaIDRDisplay(formatCurrency(p.hargaIDR, 'id-ID', 'IDR'));
                        setHargaUSDDisplay(formatCurrency(p.hargaUSD, 'en-US', 'USD'));
                        setFasilitasList(p.fasilitas ? p.fasilitas.split(',') : []);
                        setPerlengkapanList(p.perlengkapan ? p.perlengkapan.split(',') : []);

                    })
                    .catch(() => {
                        toast.error('Gagal memuat data sub paket.');
                    })
                    .finally(() => setInitialLoading(false));
            } catch (error) {
                console.error('Error fetching sub-paket:', error);
                toast.error('Gagal memuat data sub paket.');
                setInitialLoading(false);
            }
        }
    }, [id, form]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const confirmed = await confirmDialog({
                title: 'Konfirmasi Perubahan',
                description: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
                confirmText: 'Simpan',
                cancelText: 'Batal',
            });
            if (!confirmed.confirmed) return;

            const updatedSubPaket = {
                idSubpaket: id as string,
                ...values,
                idPaket: parseInt(values.idPaket),
                keberangkatan: new Date(values.keberangkatan).toISOString(),
                hargaIDR: unformatCurrency(hargaIDR.toString()),
                hargaUSD: unformatCurrency(hargaUSD.toString()),
                fasilitas: fasilitasList.filter(f => f.trim() !== '').join(','),
                perlengkapan: perlengkapanList.filter(p => p.trim() !== '').join(','),
            };

            const promise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/` + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedSubPaket),
            }).then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    toast.error(errorData.message || 'Gagal memperbarui sub paket');
                }
                return res.json();
            });

            toast.promise(promise, {
                loading: 'Menyimpan perubahan...',
                success: () => {
                    router.push('/master-subpaket');
                    return 'Sub Paket berhasil diperbarui!';
                },
                error: (err) => err.message,
            });
        } catch (error) {
            console.error('Error updating sub paket:', error);
            toast.error('Terjadi kesalahan saat memperbarui sub paket.');
        }
    };

    // Tampilkan loading jika data awal atau data paket belum siap
    if (!isClient || initialLoading || paketLoading) return <Loading />;

    return (
        <main className="flex-1 p-4 md:p-6 bg-muted/40">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Sub Paket</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* JSX Form ini SAMA PERSIS dengan halaman Tambah */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* ... (Semua <FormField> di sini sama persis dengan halaman Insert) ... */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField control={form.control} name="namaSubPaket" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Sub Paket</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="idPaket" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pilih Paket Induk</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                items={options}
                                                value={field.value}
                                                onChange={(item) => field.onChange(item.value.toString())}
                                                selectPlaceholder="Pilih paket..."
                                                searchPlaceholder="Cari paket..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField control={form.control} name="hargaIDR" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga IDR</FormLabel>
                                        <FormControl>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="hargaUSD" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga USD</FormLabel>
                                        <FormControl>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="durasiHari" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durasi (Hari)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField control={form.control} name="keberangkatan" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tanggal Keberangkatan</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="penerbangan" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Informasi Penerbangan</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="hotelMekkah" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Mekkah</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="hotelMadinah" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hotel Madinah</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormItem>
                                <FormLabel>Fasilitas</FormLabel>
                                {fasilitasList.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => {
                                                const updated = [...fasilitasList];
                                                updated[index] = e.target.value;
                                                setFasilitasList(updated);
                                            }}
                                        />
                                        <Button type="button" variant="ghost" onClick={() => {
                                            setFasilitasList(fasilitasList.filter((_, i) => i !== index));
                                        }}>
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => setFasilitasList([...fasilitasList, ''])}>
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Fasilitas
                                </Button>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Perlengkapan</FormLabel>
                                {perlengkapanList.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => {
                                                const updated = [...perlengkapanList];
                                                updated[index] = e.target.value;
                                                setPerlengkapanList(updated);
                                            }}
                                        />
                                        <Button type="button" variant="ghost" onClick={() => {
                                            setPerlengkapanList(perlengkapanList.filter((_, i) => i !== index));
                                        }}>
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => setPerlengkapanList([...perlengkapanList, ''])}>
                                    <Plus className="w-4 h-4 mr-1" /> Tambah Perlengkapan
                                </Button>
                            </FormItem>


                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}

export default withAuth(EditSubPaketPage);