// app/master-berita/tambah/page.tsx (atau lokasi file Anda)
'use client';

import React, { useState, useEffect } from 'react'; // <-- Tambahkan React di sini
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import withAuth from '@/components/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import dynamic from 'next/dynamic'; // <-- Import dynamic dari next/dynamic
import { confirmDialog } from '@/lib/confirm-dialog';

const TiptapEditor = dynamic(() => import('@/components/Editor'), {
    ssr: false,
    loading: () => <div className="text-sm text-gray-500">Loading editor...</div>,
});


// Skema Zod tidak berubah
const formSchema = z.object({
    judul: z.string().min(10, { message: 'Judul berita minimal 10 karakter.' }),
    deskripsi: z.string().min(50, { message: 'Konten berita minimal 50 karakter.' }).max(5000, { message: 'Konten berita maksimal 5000 karakter.' }),
    gambar: z.string().optional(), // Gambar bisa berupa string URL atau base64
});

function TambahBeritaPage() {
    const router = useRouter();
    // 2. Tambahkan kembali state 'editorLoaded'
    const [content, setContent] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        } else {
            setFile(null)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            judul: '',
            deskripsi: '',
            gambar: '', // Gambar bisa berupa string URL atau base64
        },
    });

    useEffect(() => {
        form.setValue('deskripsi', content, { shouldValidate: true, shouldDirty: true });
    }, [content, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {

        const confirmed = await confirmDialog({
            title: 'Konfirmasi Tambah Berita',
            description: `Apakah Anda yakin ingin menambahkan berita dengan judul "${values.judul}"?`,
            confirmText: 'Tambah',
            cancelText: 'Batal',
        });
        if (!confirmed.confirmed) {
            return;
        }

        // new formData
        try {
            const formData = new FormData();
            formData.append('judul', values.judul);
            formData.append('deskripsi', values.deskripsi);
            if (file) {
                formData.append('image', file);
            } else {
                toast.error('Gambar berita harus diupload.');
                return;
            }

            const promise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/berita`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            }).then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    toast.error(errorData.message || 'Gagal menambahkan berita');
                }
                return res.json();
            });

            toast.promise(promise, {
                loading: 'Menyimpan berita...',
                success: () => {
                    router.push('/master-berita');
                    return 'Berita berhasil ditambahkan!';
                },
                error: (err) => err.message,
            });
        } catch (error) {
            toast.error((error as Error).message || 'Terjadi kesalahan saat menambahkan berita');
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <CardHeader>
                    <CardTitle>Tambah Berita Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="judul"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Judul Berita</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan judul berita yang menarik..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gambar"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Upload Gambar</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="file"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="deskripsi"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Konten Berita</FormLabel>
                                        <FormControl>
                                            <div className="prose max-w-none rounded-md border border-input min-h-[400px] p-4">
                                                <TiptapEditor value={content} onChange={setContent} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Berita'}
                            </Button>
                        </form>
                    </Form>

                    {/* {deskripsiPreview && (
                        <div className="mt-10 border-t pt-6">
                            <h2 className="text-xl font-semibold mb-4">Preview Konten</h2>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: deskripsiPreview }}
                            />
                        </div>
                    )} */}
                </CardContent>
            </Card>
        </main>
    );
}

export default withAuth(TambahBeritaPage);