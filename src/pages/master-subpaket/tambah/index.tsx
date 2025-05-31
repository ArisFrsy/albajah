'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { SubPaket } from '@/models/SubPaket';
import { Paket } from '@/models/Paket';
import { usePaketPagination } from '../../master-paket/UsePaketPagination';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';
import { Input, Textarea } from '@/components/common/Input';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

function InsertSubPaketPage() {
    const router = useRouter();
    const [namaSubPaket, setNamaSubPaket] = useState('');
    const [idPaket, setIdPaket] = useState(0);
    const [hargaIDR, setHargaIDR] = useState(0);
    const [hargaUSD, setHargaUSD] = useState(0);
    const [keberangkatan, setKeberangkatan] = useState('');
    const [durasiHari, setDurasiHari] = useState(0);
    const [penerbangan, setPenerbangan] = useState('');
    const [hotelMekkah, setHotelMekkah] = useState('');
    const [hotelMadinah, setHotelMadinah] = useState('');
    const [fasilitas, setFasilitas] = useState('');
    const [perlengkapan, setPerlengkapan] = useState('');

    const [paketList, setPaketList] = useState<Paket[]>([]);
    // Track if rendering on client side
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const { paket, setSearch, loading } = usePaketPagination();

    useEffect(() => {
        if (paket.length > 0) {
            setPaketList(paket);
        }
    }, [paket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSubPaket: SubPaket = {
            idSubpaket: '',
            idPaket,
            namaSubPaket,
            hargaIDR,
            hargaUSD,
            keberangkatan: new Date(keberangkatan).toISOString(),
            durasiHari,
            penerbangan,
            hotelMekkah,
            hotelMadinah,
            fasilitas,
            perlengkapan,
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

            if (!response.ok) {
                throw new Error('Failed to insert sub paket');
            }

            const result = await response.json();

            if (!result.success) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to insert sub paket',
                    icon: 'error',
                });

                throw new Error(result.message || 'Failed to insert sub paket');
            }
            Swal.fire({
                title: 'Success',
                text: 'Sub Paket berhasil ditambahkan',
                icon: 'success',
            });

            router.push('/master-subpaket');

        } catch (err) {
            Swal.fire({
                title: 'Error',
                text: "Terjadi kesalahan saat menambahkan sub paket. Silakan coba lagi.",
                icon: 'error',
            });
        }
    };

    if (!isClient) {
        // Render loading atau null dulu sampai client ready supaya SSR dan CSR sama
        return <Loading />;
    }


    const resetForm = () => {
        setNamaSubPaket('');
        setIdPaket(0);
        setHargaIDR(0);
        setHargaUSD(0);
        setKeberangkatan('');
        setDurasiHari(0);
        setPenerbangan('');
        setHotelMekkah('');
        setHotelMadinah('');
        setFasilitas('');
        setPerlengkapan('');
    };

    const paketOptions = paketList.map((p) => ({
        value: p.idPaket,
        label: p.nama,
    }));

    return (
        <main className="flex-1 p-4 bg-gray-50">
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6">
                <h1 className="text-xl font-semibold mb-5 text-gray-900">Tambah Sub Paket</h1>
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <Input label="Nama Sub Paket" value={namaSubPaket} onChange={setNamaSubPaket} required />
                    <div>
                        <label className="block mb-1 text-gray-700">Pilih Paket</label>
                        <Select
                            options={paketOptions}
                            value={paketOptions.find((opt) => opt.value === idPaket)}
                            onChange={(e) => {
                                setIdPaket(e?.value || 0);
                            }}
                            placeholder="Cari paket..."
                            className="text-sm text-gray-900"
                        />
                    </div>
                    <Input label="Harga IDR" type="number" value={hargaIDR} onChange={setHargaIDR} required />
                    <Input label="Harga USD" type="number" value={hargaUSD} onChange={setHargaUSD} required />
                    <Input label="Keberangkatan" type="date" value={keberangkatan} onChange={setKeberangkatan} required />
                    <Input label="Durasi Hari" type="number" value={durasiHari} onChange={setDurasiHari} required />
                    <Input label="Penerbangan" value={penerbangan} onChange={setPenerbangan} required />
                    <Input label="Hotel Mekkah" value={hotelMekkah} onChange={setHotelMekkah} required />
                    <Input label="Hotel Madinah" value={hotelMadinah} onChange={setHotelMadinah} required />
                    <Textarea label="Fasilitas" value={fasilitas} onChange={setFasilitas} />
                    <Textarea label="Perlengkapan" value={perlengkapan} onChange={setPerlengkapan} />

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            {loading && <Loading />}
        </main>
    );
}

export default withAuth(InsertSubPaketPage);

