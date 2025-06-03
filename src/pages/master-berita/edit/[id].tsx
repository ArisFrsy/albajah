// app/master-berita/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { decrypt } from '@/lib/Encrypt';

import TiptapEditor from '@/components/Editor';
import Image from 'next/image';
import { set } from 'date-fns';
import { confirmDialog } from '@/lib/confirm-dialog';

const formSchema = z.object({
    judul: z.string().min(10, { message: 'Judul berita minimal 10 karakter.' }),
    deskripsi: z.string().min(50, { message: 'Konten berita minimal 50 karakter.' }),
    image: z.string().optional(),
});

function EditBeritaPage() {
    const router = useRouter();
    const params = useParams();
    const decryptId = params?.id as string;
    const id = decryptId ? decrypt(decryptId) : '';

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [imagePath, setImagePath] = useState('');
    const [file, setFile] = useState<File | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            judul: '',
            deskripsi: '',
            image: '',
        },
    });

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                const res = await fetch(`/api/master/berita/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!res.ok) throw new Error('Gagal mengambil data berita');
                const data = await res.json();
                form.setValue('judul', data.data.judul);
                form.setValue('deskripsi', data.data.deskripsi);
                setContent(data.data.deskripsi);
                setImagePath(data.data.imagePath || '');
                setLoading(false);
            } catch (error) {
                toast.error((error as Error).message);
                router.push('/master-berita');
            }
        };

        fetchBerita();
    }, [id, form, router]);

    useEffect(() => {
        form.setValue('deskripsi', content, { shouldValidate: true, shouldDirty: true });
    }, [content, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const confirmed = await confirmDialog({
            title: 'Konfirmasi Perubahan',
            description: `Apakah Anda yakin ingin memperbarui berita dengan judul "${values.judul}"?`,
            confirmText: 'Perbarui',
            cancelText: 'Batal',
        });
        if (!confirmed.confirmed) {
            return;
        }

        const formData = new FormData();
        formData.append('judul', values.judul);
        formData.append('deskripsi', content);
        if (file) {
            formData.append('image', file);
        } else {
            formData.append('image', values.image || '');
        }

        const promise = fetch(`/api/master/berita/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || 'Gagal memperbarui berita');
            }
            return res.json();
        });

        toast.promise(promise, {
            loading: 'Menyimpan perubahan...',
            success: () => {
                router.push('/master-berita');
                return 'Berita berhasil diperbarui!';
            },
            error: (err) => err.message,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        } else {
            setFile(null)
        }
    }

    if (loading) {
        return (
            <main className="p-6">
                <p>Memuat data berita...</p>
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <CardHeader>
                    <CardTitle>Edit Berita</CardTitle>
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
                                            <Input {...field} placeholder="Edit judul berita..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
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

                            {imagePath && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">Gambar saat ini:</p>
                                    <Image
                                        src={imagePath}
                                        alt="Foto Berita"
                                        width={100}
                                        height={100}
                                        className="rounded-md border border-gray-300 mt-1"
                                    />
                                </div>
                            )}

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
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Update Berita'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}

export default withAuth(EditBeritaPage);
