'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import withAuth from '@/components/withAuth';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Berita } from '@/models/Berita';
import Loading from '@/components/Spinner';

import { decrypt } from '@/lib/Encrypt';
import Image from 'next/image';

function ViewBeritaPage() {
    const router = useRouter();
    const params = useParams();
    const decryptId = params?.id as string;
    const id = decryptId ? decrypt(decryptId) : '';
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const [berita, setBerita] = useState<Berita | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/berita/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Gagal mengambil data berita');
                    }
                    return res.json();
                })
                .then((data) => {
                    setBerita(data.data);
                })
                .catch((err: Error) => {
                    console.error("Error fetching berita:", err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (err) {
            console.error("Unexpected error:", err);
            setError('Terjadi kesalahan saat mengambil data berita.');
            setLoading(false);
        }
    }, [id]);

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <Card className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                {loading ? (
                    <div className="flex justify-center items-center p-20">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="p-10 text-center text-red-600">
                        <p className="mb-4 text-lg font-semibold">Error: {error}</p>
                        <Button onClick={() => router.push('/master-berita')}>Kembali</Button>
                    </div>
                ) : berita ? (
                    <>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">{berita.judul}</CardTitle>
                        </CardHeader>
                        <CardContent className=''>
                            {berita.urlImage && (
                                <div className="mb-4">
                                    <Image
                                        src={baseUrl + berita.urlImage}
                                        alt={berita.judul}
                                        width={100}
                                        height={100}
                                        className="w-auto h-auto rounded-lg object-cover text-center mx-auto border border-gray-200 shadow-sm"
                                        style={{ maxWidth: 'auto', maxHeight: '400px' }}
                                    />
                                </div>
                            )}
                            <article className="border border-gray-200 px-4 mx-4 prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: berita.deskripsi || "" }} />
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => router.push('/master-berita')}>
                                    Kembali
                                </Button>
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <div className="p-10 text-center text-gray-600">
                        <p className="mb-4 text-lg font-semibold">Berita tidak ditemukan.</p>
                        <Button type="submit" onClick={() => router.push('/master-berita')}>Kembali</Button>
                    </div>
                )}
            </Card>
        </main>
    );
}

export default withAuth(ViewBeritaPage);
