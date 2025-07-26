'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form'; // Import useFieldArray
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { usePaketPagination } from '../../../hooks/UsePaketPagination';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { useIndoRegion } from '@/hooks/UseIndoRegion';



// Skema Zod yang disempurnakan untuk validasi array
const formSchema = z.object({
    namaSubPaket: z.string().min(3, { message: 'Nama sub paket harus diisi (min. 3 karakter).' }),
    idPaket: z.string().min(1, { message: 'Paket harus dipilih.' }),
    hargaIDR: z.coerce.number().gt(0, { message: 'Harga IDR harus lebih dari 0.' }),
    hargaUSD: z.coerce.number().gt(0, { message: 'Harga USD harus lebih dari 0.' }).optional().nullable(),
    // keberangkatan optional, bisa diisi atau tidak
    keberangkatan: z.string().optional(),
    durasiHari: z.coerce.number().min(1, { message: 'Durasi harus diisi (min. 1 hari).' }),
    penerbangan: z.string().optional(),
    hotelMekkah: z.string().min(3, { message: 'Informasi hotel Mekkah harus diisi.' }),
    hotelMadinah: z.string().min(3, { message: 'Informasi hotel Madinah harus diisi.' }),
    file: z.instanceof(File).optional(), // File opsional, bisa diisi atau tidak
    fasilitas: z.array(z.object({ value: z.string() }))
        .min(1, { message: 'Minimal satu fasilitas harus ditambahkan.' })
        .refine(items => items.some(item => item.value.trim() !== ''), {
            message: 'Minimal satu fasilitas harus diisi dan tidak boleh kosong.',
        }),
    perlengkapan: z.array(z.object({ value: z.string() }))
        .min(1, { message: 'Minimal satu perlengkapan harus ditambahkan.' })
        .refine(items => items.some(item => item.value.trim() !== ''), {
            message: 'Minimal satu perlengkapan harus diisi dan tidak boleh kosong.',
        }),


});

function EditSubPaketPage() {
    const router = useRouter();
    const params = useParams();
    const decryptId = params?.id as string;
    const id = decryptId ? decrypt(decryptId) : '';
    const [isClient, setIsClient] = useState(false);
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

    // State HANYA untuk tampilan format mata uang
    const [hargaIDRDisplay, setHargaIDRDisplay] = useState('');
    const [hargaUSDDisplay, setHargaUSDDisplay] = useState<string | null>('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null)
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [listAdvertise, setListAdvertise] = useState<{ value: number; label: string }[]>([]);
    const [idPaket, setIdPaket] = useState('');
    const [penerbangan, setPenerbangan] = useState('');

    const { paket, loading: paketLoading } = usePaketPagination();
    const { advertises } = useIndoRegion();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            namaSubPaket: '',
            idPaket: '',
            hargaIDR: 0,
            hargaUSD: null,
            keberangkatan: '',
            durasiHari: 0,
            penerbangan: '',
            hotelMekkah: '',
            hotelMadinah: '',
            fasilitas: [{ value: '' }],
            perlengkapan: [{ value: '' }],
        },
    });

    // useFieldArray untuk fasilitas
    const { fields: fasilitasFields, append: appendFasilitas, remove: removeFasilitas } = useFieldArray({
        control: form.control,
        name: "fasilitas",
    });

    // useFieldArray untuk perlengkapan
    const { fields: perlengkapanFields, append: appendPerlengkapan, remove: removePerlengkapan } = useFieldArray({
        control: form.control,
        name: "perlengkapan",
    });

    // Mengambil data paket (untuk combobox)
    useEffect(() => {
        if (paket.length > 0) {
            const paketOptions = paket.map((p) => ({ value: p.idPaket, label: p.nama }));
            setOptions(paketOptions);
        }
    }, [paket]);

    // Mengambil data iklan (untuk combobox)
    useEffect(() => {
        if (advertises.length > 0) {
            const advertiseOptions = advertises.map((ad) => ({ value: ad.id, label: ad.name }));
            setListAdvertise(advertiseOptions);
        }
    }, [advertises]);

    // Mengambil data sub-paket yang akan diedit
    useEffect(() => {
        if (id) {
            setInitialLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.data) throw new Error("Data tidak ditemukan");
                    const p: SubPaket = data.data;

                    form.reset({
                        namaSubPaket: p.namaSubPaket || '',
                        idPaket: p.idPaket?.toString() || '',
                        hargaIDR: p.hargaIDR || 0,
                        hargaUSD: p.hargaUSD || null,
                        keberangkatan: p.keberangkatan?.split('T')[0] || '',
                        durasiHari: p.durasiHari || 0,
                        penerbangan: p.penerbangan || '',
                        hotelMekkah: p.hotelMekkah || '',
                        hotelMadinah: p.hotelMadinah || '',
                        fasilitas: p.fasilitas ? p.fasilitas.split(',').map(f => ({ value: f.trim() })) : [{ value: '' }],
                        perlengkapan: p.perlengkapan ? p.perlengkapan.split(',').map(p => ({ value: p.trim() })) : [{ value: '' }],
                    });

                    // Set state tampilan harga
                    setHargaIDRDisplay(formatCurrency(p.hargaIDR, 'id-ID', 'IDR'));
                    setHargaUSDDisplay(p.hargaUSD ? formatCurrency(p.hargaUSD, 'en-US', 'USD') : null);
                    setCurrentImage(p.urlFoto ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${p.urlFoto}` : null);
                    setIdPaket(p.idPaket ? p.idPaket.toString() : '');
                    setPenerbangan(p.penerbangan || '');
                })
                .catch(() => toast.error('Gagal memuat data sub paket.'))
                .finally(() => setInitialLoading(false));
        }
    }, [id, form]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const confirmed = await confirmDialog({
            title: 'Konfirmasi Perubahan',
            description: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
            confirmText: 'Simpan',
            cancelText: 'Batal',
        });
        if (!confirmed.confirmed) return;

        const updatedSubPaket = {
            idSubpaket: id,
            ...values,
            idPaket: parseInt(values.idPaket),
            keberangkatan: values.keberangkatan ? new Date(values.keberangkatan).toISOString() : "", // Biarkan undefined jika tidak diisi
            // Ambil nilai dari 'values' yang sudah divalidasi
            hargaIDR: values.hargaIDR,
            hargaUSD: values.hargaUSD,
            // Ubah kembali ke format string
            fasilitas: values.fasilitas.map(f => f.value.trim()).filter(f => f).join(','),
            perlengkapan: values.perlengkapan.map(p => p.value.trim()).filter(p => p).join(','),
        };
        // new form data untuk upload file
        const formData = new FormData();
        formData.append('namaSubPaket', updatedSubPaket.namaSubPaket);
        formData.append('idPaket', idPaket);
        formData.append('hargaIDR', updatedSubPaket.hargaIDR.toString());
        if (updatedSubPaket.hargaUSD && updatedSubPaket.hargaUSD != null) {
            formData.append('hargaUSD', updatedSubPaket.hargaUSD.toString());
        }
        formData.append('keberangkatan', updatedSubPaket.keberangkatan);
        formData.append('durasiHari', updatedSubPaket.durasiHari.toString());
        formData.append('penerbangan', penerbangan);
        formData.append('hotelMekkah', updatedSubPaket.hotelMekkah);
        formData.append('hotelMadinah', updatedSubPaket.hotelMadinah);
        formData.append('fasilitas', updatedSubPaket.fasilitas);
        formData.append('perlengkapan', updatedSubPaket.perlengkapan);
        if (file) {
            formData.append('fileFoto', file);
        }

        const promise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/${id}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal memperbarui sub paket');
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

    if (!isClient || initialLoading || paketLoading) return <Loading />;

    return (
        <main className="flex-1 p-4 md:p-6 bg-muted/40">
            <Card>
                <CardHeader><CardTitle>Edit Sub Paket</CardTitle></CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Fields: Nama Sub Paket & Pilih Paket Induk */}
                                <FormField control={form.control} name="namaSubPaket" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Sub Paket</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="idPaket" render={({ }) => (
                                    <FormItem><FormLabel>Pilih Paket Induk</FormLabel><FormControl>
                                        <Combobox items={options} value={idPaket} onChange={setIdPaket} type='single'
                                            selectPlaceholder="Pilih paket..." searchPlaceholder="Cari paket..." />
                                    </FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {/* Field: Upload Foto */}
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel className="text-sm font-medium text-gray-700">Upload Foto</FormLabel>
                                    <div className="flex items-center gap-3">
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="w-full"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setFile(file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setCurrentImage(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setCurrentImage(null);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>

                                {/* Preview Gambar */}
                                {currentImage && (
                                    <div className="flex items-start justify-start">
                                        <img
                                            src={currentImage}
                                            alt="Preview"
                                            className="max-h-48 rounded-md object-cover border border-gray-200"
                                        />
                                    </div>
                                )}
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fields: Harga IDR & Harga USD */}
                                <FormField control={form.control} name="hargaIDR" render={() => (
                                    <FormItem><FormLabel>Harga IDR</FormLabel><FormControl>
                                        <Input value={hargaIDRDisplay}
                                            onChange={(e) => {
                                                const numeric = unformatCurrency(e.target.value);
                                                setHargaIDRDisplay(formatCurrency(numeric, 'id-ID', 'IDR'));
                                                form.setValue('hargaIDR', numeric, { shouldValidate: true });
                                            }} />
                                    </FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="hargaUSD" render={() => (
                                    <FormItem><FormLabel>Harga USD</FormLabel><FormControl>
                                        <Input value={hargaUSDDisplay ? hargaUSDDisplay : ''}
                                            onChange={(e) => {
                                                const numeric = unformatCurrency(e.target.value);
                                                setHargaUSDDisplay(formatCurrency(numeric, 'en-US', 'USD'));
                                                form.setValue('hargaUSD', numeric, { shouldValidate: true });
                                            }} />
                                    </FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Fields: Keberangkatan, Durasi, Penerbangan */}
                                <FormField control={form.control} name="keberangkatan" render={({ field }) => (
                                    <FormItem><FormLabel>Keberangkatan</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="durasiHari" render={({ field }) => (
                                    <FormItem><FormLabel>Durasi Hari</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="penerbangan" render={({ }) => (
                                    <FormItem><FormLabel>Penerbangan</FormLabel><FormControl>
                                        <Combobox items={listAdvertise} value={penerbangan} type='multiple' onChange={setPenerbangan}
                                            selectPlaceholder="Pilih Penerbangan..." searchPlaceholder="Cari Penerbangan..." />
                                    </FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fields: Hotel Mekkah & Hotel Madinah */}
                                <FormField control={form.control} name="hotelMekkah" render={({ field }) => (
                                    <FormItem><FormLabel>Hotel Mekkah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="hotelMadinah" render={({ field }) => (
                                    <FormItem><FormLabel>Hotel Madinah</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>

                            {/* Fasilitas list - Dikelola oleh useFieldArray */}
                            <FormItem>
                                <FormLabel>Fasilitas</FormLabel>
                                {fasilitasFields.map((field, index) => (
                                    <FormField key={field.id} control={form.control} name={`fasilitas.${index}.value`} render={({ field: itemField }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2">
                                                <FormControl><Input {...itemField} placeholder={`Fasilitas ${index + 1}`} /></FormControl>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFasilitas(index)} disabled={fasilitasFields.length <= 1}>
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendFasilitas({ value: '' })}><Plus className="w-4 h-4 mr-1" /> Tambah Fasilitas</Button>
                                <FormMessage>{form.formState.errors.fasilitas?.message}</FormMessage>
                            </FormItem>

                            {/* Perlengkapan list - Dikelola oleh useFieldArray */}
                            <FormItem>
                                <FormLabel>Perlengkapan</FormLabel>
                                {perlengkapanFields.map((field, index) => (
                                    <FormField key={field.id} control={form.control} name={`perlengkapan.${index}.value`} render={({ field: itemField }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2">
                                                <FormControl><Input {...itemField} placeholder={`Perlengkapan ${index + 1}`} /></FormControl>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removePerlengkapan(index)} disabled={perlengkapanFields.length <= 1}>
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ))}
                                <Button type="button" variant="outline" onClick={() => appendPerlengkapan({ value: '' })}><Plus className="w-4 h-4 mr-1" /> Tambah Perlengkapan</Button>
                                <FormMessage>{form.formState.errors.perlengkapan?.message}</FormMessage>
                            </FormItem>

                            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}

export default withAuth(EditSubPaketPage);