'use client';

import React from 'react';
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { decrypt } from '@/lib/Encrypt';
import { confirmDialog } from '@/lib/confirm-dialog';

const formSchema = z
    .object({
        name: z.string().min(2, 'Nama minimal 2 karakter'),
        email: z.string().email('Email tidak valid'),
        currentPassword: z.string().optional(),
        newPassword: z.string().min(4, 'Minimal 4 karakter').optional(),
        confirmPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword || data.confirmPassword) {
                return data.newPassword === data.confirmPassword;
            }
            return true;
        },
        {
            path: ['confirmPassword'],
            message: 'Konfirmasi password tidak cocok',
        }
    );

function SettingProfilePage() {
    const params = useParams();
    const decryptId = params?.id as string;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/` + decrypt(decryptId), {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!res.ok) {
                    toast.error('Gagal mengambil data profil');
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login'; // redirect to login page
                    }
                }

                const data = await res.json();
                form.setValue('name', data.data.name);
                form.setValue('email', data.data.email);
            } catch (err) {
                toast.error((err as Error).message);
            }
        };

        fetchProfile();
    }, [form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const confirmed = await confirmDialog({
                title: 'Konfirmasi Perubahan',
                description: `Apakah Anda yakin ingin memperbarui profil dengan nama "${values.name}" dan email "${values.email}"?`,
                confirmText: 'Perbarui',
                cancelText: 'Batal',
            });

            if (!confirmed.confirmed) {
                return;
            }

            const payload: Record<string, string> = {
                name: values.name,
                email: values.email,
            };

            if (values.currentPassword && values.newPassword && values.confirmPassword) {
                payload.current_password = values.currentPassword;
                payload.new_password = values.newPassword;
                payload.new_password_confirmation = values.confirmPassword;
            }

            const promise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/` + decrypt(decryptId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            }).then(async (res) => {
                if (!res.ok) {
                    toast.error('Gagal memperbarui profil');
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login'; // redirect to login page
                    }
                }
                return res.json();
            });

            toast.promise(promise, {
                loading: 'Menyimpan...',
                success: () => {
                    form.reset({
                        name: values.name,
                        email: values.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                    return 'Profil berhasil diperbarui!';
                },
                error: (err) => err.message,
            });
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <CardHeader>
                    <CardTitle>Pengaturan Profil</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap</FormLabel>
                                            <Input
                                                placeholder="Masukkan nama lengkap"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                type="email"
                                                placeholder="Masukkan email"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="border-t pt-4 space-y-6">
                                <h2 className="text-md font-semibold">Ubah Password (Opsional)</h2>

                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password Saat Ini</FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password Baru</FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Konfirmasi Password Baru</FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}

export default withAuth(SettingProfilePage);
