'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SubPaket } from '@/models/SubPaket';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';
import React from 'react';

// Import ikon dari lucide-react
import {
    Package, Tag, Calendar, Clock, Send, Home,
    CheckSquare, List, ArrowLeft, DollarSign
} from 'lucide-react';

function ViewSubPaketPage() {
    const router = useRouter();
    const { id } = router.query;
    const [subPaket, setSubPaket] = useState<SubPaket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/master/sub-paket/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Gagal mengambil data');
                    }
                    return res.json();
                })
                .then(data => {
                    setSubPaket(data.data || null);
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    setSubPaket(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <main className="flex-1 p-6 bg-slate-50 flex items-center justify-center min-h-screen">
                <Loading />
            </main>
        );
    }

    if (!subPaket) {
        return (
            <main className="flex-1 p-6 bg-slate-50 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Data Tidak Ditemukan</h2>
                    <p className="text-slate-500 mb-6">Sub Paket yang Anda cari tidak ada atau telah dihapus.</p>
                    <button
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                        onClick={() => router.push('/master-subpaket')}
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Daftar
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                {/* Tombol Kembali diletakkan di atas untuk navigasi yang mudah */}
                {/* <div className="mb-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </button>
                </div> */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-800">{subPaket.namaSubPaket}</h1>
                        <p className="text-md text-slate-500 mt-1">Detail lengkap untuk sub paket.</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Section: Detail Utama & Harga */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">Informasi Paket & Harga</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <DetailItem icon={<Package />} label="Nama Paket Utama" value={subPaket.paket?.nama || '-'} />
                                <DetailItem icon={<Clock />} label="Durasi" value={`${subPaket.durasiHari} hari`} />
                                <DetailItem icon={<Tag />} label="Harga IDR" value={`Rp ${subPaket.hargaIDR?.toLocaleString('id-ID') || '0'}`} />
                                <DetailItem icon={<DollarSign />} label="Harga USD" value={`$ ${subPaket.hargaUSD?.toLocaleString('en-US') || '0'}`} />
                            </div>
                        </section>

                        {/* Section: Jadwal & Akomodasi */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">Jadwal & Akomodasi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <DetailItem icon={<Calendar />} label="Tanggal Keberangkatan" value={new Date(String(subPaket.keberangkatan)).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} />
                                <DetailItem icon={<Send />} label="Maskapai Penerbangan" value={subPaket.penerbangan} />
                                <DetailItem icon={<Home />} label="Hotel Mekkah" value={subPaket.hotelMekkah} />
                                <DetailItem icon={<Home />} label="Hotel Madinah" value={subPaket.hotelMadinah} />
                            </div>
                        </section>

                        {/* Section: Inklusi Paket */}
                        <section>
                            <h2 className="text-lg font-semibold text-slate-700 mb-4">Fasilitas & Perlengkapan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <DetailItem icon={<CheckSquare />} label="Fasilitas" value={subPaket.fasilitas ?? '-'} />
                                <DetailItem icon={<List />} label="Perlengkapan" value={subPaket.perlengkapan ?? '-'} />
                            </div>
                        </section>
                    </div>

                    {/* Footer Aksi */}
                    <div className="p-6 bg-slate-50/50 rounded-b-2xl flex justify-end">
                        <button
                            className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            onClick={() => router.push('/master-subpaket')}
                        >
                            Kembali ke Daftar
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Komponen DetailItem baru yang lebih visual dengan ikon
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <div className="flex items-start gap-4"> {/* Menambah gap untuk ruang ekstra */}
        <div className="flex-shrink-0 text-slate-400 mt-1">
            {/* Lucide icons bisa diatur ukurannya langsung via props */}
            {icon && (
                // Clone elemen ikon untuk menambahkan props size dan className
                // @ts-ignore
                (React.cloneElement(icon, { size: 22, className: "stroke-current" }))
            )}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-base text-slate-800 font-semibold">{value}</p>
        </div>
    </div>
);

export default withAuth(ViewSubPaketPage);