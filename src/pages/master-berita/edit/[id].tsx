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

import TiptapEditor from '@/components/Editor';

const formSchema = z.object({
    judul: z.string().min(10, { message: 'Judul berita minimal 10 karakter.' }),
    deskripsi: z.string().min(50, { message: 'Konten berita minimal 50 karakter.' }),
});

function EditBeritaPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            judul: '',
            deskripsi: '',
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
        const promise = fetch(`/api/master/berita/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(values),
        }).then(async (res) => {
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal memperbarui berita');
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
