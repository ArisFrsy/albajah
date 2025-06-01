'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
    const { id } = router.query;
    const [isClient, setIsClient] = useState(false);
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

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
            setInitialLoading(true);
            fetch(`/api/master/sub-paket/${id}`, {
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
                })
                .catch(() => {
                    toast.error('Gagal memuat data sub paket.');
                })
                .finally(() => setInitialLoading(false));
        }
    }, [id, form]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const confirmUpdate = await Swal.fire({
            title: 'Konfirmasi Perubahan',
            text: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
        });

        if (!confirmUpdate.isConfirmed) return;

        const updatedSubPaket = {
            idSubpaket: id as string,
            ...values,
            idPaket: parseInt(values.idPaket),
            keberangkatan: new Date(values.keberangkatan).toISOString(),
        };

        const promise = fetch(`/api/master/sub-paket`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedSubPaket),
        }).then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal memperbarui data');
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
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="hargaUSD" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga USD</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
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

                            <div className="space-y-2">
                                <FormField control={form.control} name="fasilitas" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fasilitas</FormLabel>
                                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="perlengkapan" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Perlengkapan</FormLabel>
                                        <FormControl><Textarea {...field} rows={3} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

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