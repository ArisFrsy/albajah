"use client";

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useState } from "react";
import { usePaketPagination } from "../../hooks/UsePaketPagination";
import { Paket } from "@/models/Paket";
import { Header } from "@/components/Header";
import InsertPaketModal from "./InsertPaketModal";
import Loading from "@/components/Spinner";
import DetailPaketModal from "./DetailPaketModal";
import EditPaketModal from "./EditPaketModal";
import { Eye, Edit, Plus, Trash2 } from "lucide-react";
import { confirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";



function MasterPaketPage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (paket: Paket) => {
        setSelectedPaket(paket);
        setShowEditModal(true);
    }

    const handleDetail = (paket: Paket) => {
        setSelectedPaket(paket);
        setShowDetailModal(true);
    }

    const { paket, page, limit, setPage, setLimit, orderByField, setOrderByField, fetchPaket, loading, setLoading, setSearch, totalPage, setOrderByDirection, orderByDirection } = usePaketPagination();

    const headers: Header<Paket>[] = [
        { column: 'no', label: 'No', orderable: false, align: 'left' },
        { column: 'nama', label: 'Nama Paket', orderable: true, align: 'left' },
        { column: 'deskripsi', label: 'Deskripsi', orderable: false, align: 'left' },
        {
            column: 'foto', label: 'Foto', orderable: false, align: 'left', render: (row: Paket) => (
                <img src={baseUrl + row.urlFoto || '/images/no-image.png'} alt={row.nama} className="w-16 h-16 object-cover rounded" />
            )
        },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: Paket) => (
                <>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => handleDetail(row)}
                        >
                            <Eye size={16} className="inline" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => handleEdit(row)}
                        >
                            <Edit size={16} className="inline" />
                        </Button>

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


    const handleInsert = async (data: { nama: string; deskripsi?: string, fileFoto?: File | null }) => {
        try {
            // Show confirmation dialog
            const result = await confirmDialog({
                title: 'Konfirmasi',
                description: 'Apakah Anda yakin ingin menambahkan paket ini?',
                confirmText: 'Ya',
                cancelText: 'Batal',
            });
            if (!result.confirmed) {
                return; // User canceled, do not proceed
            }


            setLoading(true);
            // new form data
            const formData = new FormData();
            formData.append('nama', data.nama);
            if (data.deskripsi) {
                formData.append('deskripsi', data.deskripsi);
            }
            if (data.fileFoto) {
                formData.append('fileFoto', data.fileFoto);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/paket`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            })
            setLoading(false);

            if (!res.ok) {
                toast.error('Gagal menambahkan paket. Silakan coba lagi.');
            }

            toast.success('Paket berhasil ditambahkan.');

            fetchPaket();
            // Optionally refresh list here
        } catch {
            setLoading(false);

            toast.error('Terjadi kesalahan saat menambahkan paket.');

        }
    }


    const handleUpdate = async (data: { idPaket: number; nama: string; deskripsi?: string; fileFoto?: File | null }) => {
        try {
            // Show confirmation dialog
            const result = await confirmDialog({
                title: 'Konfirmasi',
                description: 'Apakah Anda yakin ingin memperbarui paket ini?',
                confirmText: 'Ya',
                cancelText: 'Batal',
            });
            if (!result.confirmed) {
                return; // User canceled, do not proceed
            }

            setLoading(true);
            // new form data
            const formData = new FormData();
            formData.append('id', data.idPaket.toString());
            formData.append('nama', data.nama);
            if (data.deskripsi) {
                formData.append('deskripsi', data.deskripsi);
            }
            if (data.fileFoto) {
                formData.append('fileFoto', data.fileFoto);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/paket/` + selectedPaket?.idPaket, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            })
            setLoading(false);
            if (!res.ok) {
                toast.error('Gagal memperbarui paket. Silakan coba lagi.');
            }
            toast.success('Paket berhasil diperbarui.');
            fetchPaket();
        } catch {
            setLoading(false);
            toast.error('Terjadi kesalahan saat memperbarui paket.');
        }
    }

    const handleDelete = async (data: { idPaket: number }) => {
        try {
            // Show confirmation dialog
            const result = await confirmDialog({
                title: 'Konfirmasi',
                description: 'Apakah Anda yakin ingin menghapus paket ini?',
                confirmText: 'Ya',
                cancelText: 'Batal',
            });
            if (!result.confirmed) {
                return; // User canceled, do not proceed
            }
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/paket/` + data.idPaket, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id: data.idPaket }),
            })
            setLoading(false);
            if (!res.ok) {
                toast.error('Gagal menghapus paket. Silakan coba lagi.');
            }

            toast.success('Paket berhasil dihapus.');

            fetchPaket();
        } catch {
            setLoading(false);

            toast.error('Terjadi kesalahan saat menghapus paket.');
        }
    }

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <div className="flex items-center justify-between mb-4">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center gap-1 text-sm text-gray-700">
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
                                <a href="#" className="block transition-colors hover:text-gray-900 text-base"> Master Paket </a>
                            </li>
                        </ol>
                    </nav>
                    <a
                        className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="inline mr-1" />
                        Tambah Data
                    </a>
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
                        <input
                            type="text"
                            placeholder="Cari Paket..."
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <DataTable
                        data={paket}
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
            <InsertPaketModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleInsert} />

            <DetailPaketModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                data={selectedPaket}
            />

            <EditPaketModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                data={selectedPaket}
                onSubmit={handleUpdate} />

            {loading && (
                <Loading />
            )}
        </main>
    );
}

export default withAuth(MasterPaketPage);