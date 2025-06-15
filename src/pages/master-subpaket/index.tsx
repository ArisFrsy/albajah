"use client";

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSubPaketPagination } from "../../hooks/UseSubPaketPagination";
import { SubPaket } from "@/models/SubPaket";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Plus, Trash2, ListFilter } from "lucide-react";
import Link from "next/link";
import { encrypt } from "@/lib/Encrypt";
import { confirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { usePaketPagination } from "@/hooks/UsePaketPagination";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatCurrency";

function MasterSubPaket() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const router = useRouter();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
    const [idPaket, setIdPaket] = useState('');

    const { paket } = usePaketPagination(1, 1000);

    useEffect(() => {
        if (paket.length > 0) {
            const paketOptions = paket.map((p) => ({
                value: p.idPaket,
                label: p.nama,
            }));

            setOptions(paketOptions);

        }
    }, [paket]);

    const handleDelete = async (subPaket: SubPaket) => {
        const confirmed = await confirmDialog({
            title: "Konfirmasi Hapus",
            description: `Apakah Anda yakin ingin menghapus sub paket "${subPaket.namaSubPaket}"?`,
            confirmText: "Hapus",
            cancelText: "Batal",
        });

        if (confirmed.confirmed) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/sub-paket/${subPaket.idSubpaket}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    toast.error("Gagal menghapus sub paket. Pastikan tidak ada data terkait yang masih digunakan.");
                }

                toast.success("Sub paket berhasil dihapus.");

                // Refresh data after deletion
                router.reload();
            } catch {
                toast.error("Terjadi kesalahan saat menghapus sub paket.");
            }
        }
    }

    const headers: Header<SubPaket>[] = [
        { column: "namaSubPaket", label: "Sub Paket", orderable: true, align: "left" },
        { column: "paket.nama", label: "Paket", orderable: true, align: "left" },
        {
            column: 'foto', label: 'Foto', orderable: false, align: 'left', render: (row: SubPaket) => (
                <img src={baseUrl + row.urlFoto || '/images/no-image.png'} alt={row.namaSubPaket} className="w-16 h-16 object-cover rounded" />
            )
        },
        {
            column: "hargaIDR", label: "IDR", align: "right", render: (row: SubPaket) => (
                formatCurrency(row.hargaIDR, 'id-ID', 'IDR')
            )
        },
        {
            column: "hargaUSD", label: "USD", align: "right", render: (row: SubPaket) => (
                <>
                    {formatCurrency(row.hargaUSD, 'en-US', 'USD')}
                </>
            )
        },
        {
            column: "keberangkatan", label: "Keberangkatan", align: "left", render: (row: SubPaket) => (
                new Date(row.keberangkatan).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
            )
        },
        {
            column: "durasiHari", label: "Durasi", orderable: true, align: "right", render: (row: SubPaket) => (
                `${row.durasiHari} Hari`
            )
        },
        // { column: "penerbangan", label: "Penerbangan", orderable: true, align: "left" },
        // { column: "hotelMekkah", label: "Hotel Mekkah", orderable: true, align: "left" },
        // { column: "hotelMadinah", label: "Hotel Madinah", orderable: true, align: "left" },
        // { column: "fasilitas", label: "Fasilitas", orderable: false, align: "left" },
        // { column: "perlengkapan", label: "Perlengkapan", orderable: false, align: "left" },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: SubPaket) => (
                <>
                    <div className="flex gap-2">

                        <Link href={`/master-subpaket/view/${encrypt(row.idSubpaket)}`} passHref>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                                <Eye size={16} className="inline" />
                            </Button>
                        </Link>
                        <Link href={`/master-subpaket/edit/${encrypt(row.idSubpaket)}`} passHref>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-500 text-white hover:bg-green-600"
                            >
                                <Edit size={16} className="inline" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDelete(row)}
                        >
                            <Trash2 size={16} className="inline" />
                        </Button>
                    </div>
                </>
            ),
        },
    ]

    const {
        subPaket,
        page,
        limit,
        setPage,
        setLimit,
        orderByField,
        setOrderByField,
        loading,
        setSearch,
        setIdPaketFilter,
        totalPage,
        orderByDirection,
        setOrderByDirection
    } = useSubPaketPagination();


    return (<main className="flex-1 p-6 overflow-auto bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
            <div className="flex items-center justify-between mb-4">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1 text-sm text-gray-700 font-bold">
                        <li>
                            <a href="#" className="block transition-colors hover:text-gray-900 text-base"> Admin </a>
                        </li>
                        <li className="rtl:rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </li>
                        <li>
                            <a href="#" className="block transition-colors hover:text-gray-900 text-base"> Master Sub Paket </a>
                        </li>
                    </ol>
                </nav>
                <Link href="/master-subpaket/tambah" passHref>
                    <div className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-bold text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden">
                        <Plus className="inline mr-1" />
                        Tambah Data
                    </div>
                </Link>
            </div>
            {/* line separator */}
            <hr className="my-4 border-gray-300" />

            <div className="flex justify-between items-center mb-4">
                {/* <a
                    className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden"
                    href="#"
                >
                    Filter
                </a> */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                        onClick={() => setShowFilterModal(true)}
                    >
                        <ListFilter size={16} className="mr-1" />
                        Filter
                    </Button>
                    <input
                        type="text"
                        placeholder="Cari Sub Paket..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearch((e.target as HTMLInputElement).value);
                            }
                        }}
                    />

                    {/* ✅ Tombol Filter */}
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                <DataTable
                    data={subPaket}
                    headers={headers}
                    page={page}
                    perPage={limit}
                    setPage={setPage}
                    setPerPage={setLimit}
                    orderBy={orderByField}
                    order={orderByDirection}
                    setOrderBy={setOrderByField}
                    setOrder={setOrderByDirection}
                    totalPages={totalPage}
                />
            </div>

        </div>

        {/* <DetailPaketModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            data={selectedPaket}
        />

        <EditPaketModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            data={selectedPaket}
            onSubmit={handleUpdate} /> */}

        {loading && (
            <Loading />
        )}

        {/* ✅ Modal Filter */}
        <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filter Sub Paket</DialogTitle>
                </DialogHeader>

                {/* ✅ Isi Filter (contoh input tahun keberangkatan) */}
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Pilih Paket</Label>
                        <Combobox
                            items={options}
                            value={idPaket}
                            onChange={setIdPaket}
                            type="single"
                            selectPlaceholder="Pilih Paket"
                            searchPlaceholder="Cari paket..."
                        />

                    </div>

                    {/* Tambahkan filter lain di sini */}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        setShowFilterModal(false);
                        setIdPaket(''); // Reset filter when modal is closed
                        setIdPaketFilter(''); // Reset filter state
                    }}>
                        Batal
                    </Button>
                    <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => {
                            setShowFilterModal(false); // Set the filter state
                            setIdPaketFilter(idPaket); // Apply the selected filter
                        }}
                    >
                        Terapkan Filter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </main>);
}

export default withAuth(MasterSubPaket);