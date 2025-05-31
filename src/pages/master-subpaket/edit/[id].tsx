'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { SubPaket } from '@/models/SubPaket';
import { Paket } from '@/models/Paket';
import { usePaketPagination } from '../../master-paket/UsePaketPagination';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';
import { Input, Textarea } from '@/components/common/Input';
import Swal from 'sweetalert2';

function EditSubPaketPage() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

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
    const { paket, setSearch, loading: loadingPaket } = usePaketPagination();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (paket.length > 0) setPaketList(paket);
    }, [paket]);

    useEffect(() => {
        if (id) {
            fetch(`/api/master/sub-paket/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const p: SubPaket = data.data;
                    setNamaSubPaket(p.namaSubPaket || '');
                    setIdPaket(p.idPaket || 0);
                    setHargaIDR(p.hargaIDR || 0);
                    setHargaUSD(p.hargaUSD || 0);
                    setKeberangkatan(p.keberangkatan?.split('T')[0] || '');
                    setDurasiHari(p.durasiHari || 0);
                    setPenerbangan(p.penerbangan || '');
                    setHotelMekkah(p.hotelMekkah || '');
                    setHotelMadinah(p.hotelMadinah || '');
                    setFasilitas(p.fasilitas || '');
                    setPerlengkapan(p.perlengkapan || '');
                })
                .catch(() => {
                    Swal.fire('Error', 'Gagal memuat data sub paket.', 'error');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // confirmation before updating
        const confirmUpdate = await Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin memperbarui sub paket ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, perbarui',
            cancelButtonText: 'Batal',
        });

        if (!confirmUpdate.isConfirmed) return;

        const updatedSubPaket: SubPaket = {
            idSubpaket: id as string,
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

            const response = await fetch(`/api/master/sub-paket`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedSubPaket),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                Swal.fire({
                    title: 'Error',
                    text: 'Gagal memperbarui sub paket.',
                    icon: 'error',
                });
                return;

            }

            Swal.fire('Success', 'Sub Paket berhasil diperbarui', 'success');
            router.push('/master-subpaket');
        } catch (err) {
            Swal.fire('Error', 'Gagal memperbarui sub paket.', 'error');
        }
    };

    const paketOptions = paketList.map((p) => ({
        value: p.idPaket,
        label: p.nama,
    }));

    if (!isClient || loading || loadingPaket) return <Loading />;

    return (
        <main className="flex-1 p-4 bg-gray-50">
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 p-6 min-h-[calc(110vh-7rem)]">
                <h1 className="text-xl font-semibold mb-5 text-gray-900">Edit Sub Paket</h1>
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <Input label="Nama Sub Paket" value={namaSubPaket} onChange={setNamaSubPaket} required />
                    <div>
                        <label className="block mb-1 text-gray-700">Pilih Paket</label>
                        <Select
                            options={paketOptions}
                            value={paketOptions.find((opt) => opt.value === idPaket)}
                            onChange={(e) => setIdPaket(e?.value || 0)}
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
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default withAuth(EditSubPaketPage);
