'use client';

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCabangPagination } from "./UseCabangPagination";
import { Cabang } from "@/models/Cabang";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Delete, Plus, Search, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import InsertCabangModal from "./InsertCabangModal";
import EditCabangModal from "./EditCabangModal";
import DetailCabangModal from "./DetailCabangModal";
import { confirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function MasterCabang() {
    const router = useRouter();
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCabang, setSelectedCabang] = useState<Cabang | null>(null);

    const handleEdit = (cabang: Cabang) => {
        setSelectedCabang(cabang);
        setShowEditModal(true);
    }

    const handleDetail = (cabang: Cabang) => {
        setSelectedCabang(cabang);
        setShowDetailModal(true);
    }
    const {
        cabang,
        totalPage,
        page,
        limit,
        setPage,
        setLimit,
        orderByField,
        setOrderByField,
        orderByDirection,
        setOrderByDirection,
        loading,
        search,
        setSearch,
        fetchCabang,
    } = useCabangPagination();

    const headers: Header<Cabang>[] = [
        { column: 'provinces.name', label: 'Provinsi', align: 'left' },
        { column: 'regencies.name', label: 'Kabupaten', align: 'left' },
        { column: 'penanggungjawab', label: 'Penanggung Jawab', align: 'left' },
        {
            column: 'email',
            label: 'Email',
            align: 'left',

        },
        { column: 'noTelepon', label: 'No Telepon', align: 'left' },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: Cabang) => (
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

    const handleInsert = async (data: { cabang: Cabang }) => {
        const confirm = await confirmDialog({
            title: 'Konfirmasi',
            description: 'Apakah Anda yakin ingin menambahkan data cabang ini?',
            confirmText: 'Ya, Tambah',
            cancelText: 'Batal',
        });

        if (!confirm.confirmed) {
            return; // User cancelled the operation
        }

        try {
            const response = await fetch('/api/master/cabang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data.cabang),
            });

            if (!response.ok) {
                // if unauthorized, clear token and redirect to login
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login"; // redirect to login page
                    return;
                }
            }

            toast.success('Data cabang berhasil ditambahkan');

            setShowModal(false);
            fetchCabang(); // Refresh the data after insertion
        } catch (error) {
            toast.error('Terjadi kesalahan saat menambahkan data cabang. Silakan coba lagi.');
        }
    }

    const handleUpdate = async (data: { cabang: Cabang }) => {
        const confirm = await confirmDialog({
            title: 'Konfirmasi',
            description: 'Apakah Anda yakin ingin memperbarui data cabang ini?',
            confirmText: 'Ya, Perbarui',
            cancelText: 'Batal',
        });

        if (!confirm.confirmed) {
            return; // User cancelled the operation
        }

        if (!selectedCabang) return;
        try {
            const response = await fetch(`/api/master/cabang/${selectedCabang.idCabang}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data.cabang),
            });

            if (!response.ok) {
                // if unauthorized, clear token and redirect to login
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login"; // redirect to login page
                    return;
                }
            }

            toast.success('Data cabang berhasil diperbarui');

            setShowModal(false);
            fetchCabang(); // Refresh the data after update
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data cabang. Silakan coba lagi.');
        }
        setSelectedCabang(null); // Clear selected cabang after update
    }

    const handleDelete = async (cabang: Cabang) => {
        const confirm = await confirmDialog({
            title: 'Konfirmasi Hapus',
            description: `Apakah Anda yakin ingin menghapus cabang ?`,
            confirmText: 'Hapus',
            cancelText: 'Batal',
        });

        if (!confirm.confirmed) {
            return; // User cancelled the operation
        }

        try {
            const response = await fetch(`/api/master/cabang/${cabang.idCabang}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                // if unauthorized, clear token and redirect to login
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login"; // redirect to login page
                    return;
                }
            }

            toast.success('Data cabang berhasil dihapus');
            fetchCabang(); // Refresh the data after deletion
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus data cabang. Silakan coba lagi.');
        }
    }

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1 text-sm text-gray-700">
                        <li>
                            <a href="#" className="block transition-colors hover:text-gray-900"> Admin </a>
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
                            <a href="#" className="block transition-colors hover:text-gray-900"> Master Cabang </a>
                        </li>
                    </ol>
                </nav>
                <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Master Cabang</h1>
                {/* line separator */}
                <hr className="my-4 border-gray-300" />
                <br />
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
                            placeholder="Cari Cabang..."
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                    </div>

                    <a
                        className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus className="inline mr-1" />
                        Tambah Data
                    </a>
                </div>

                <br />
                <div className="w-full overflow-x-auto">
                    <DataTable
                        data={cabang}
                        headers={headers}
                        page={page}
                        perPage={limit}
                        setPage={setPage}
                        setPerPage={setLimit}
                        orderBy={orderByField}
                        order={order}
                        setOrderBy={setOrderByField}
                        setOrder={setOrder}
                    />
                </div>

            </div>
            <InsertCabangModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleInsert} />

            <DetailCabangModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                data={selectedCabang}
            />

            <EditCabangModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                initialData={selectedCabang}
                onSubmit={handleUpdate} />

            {loading && (
                <Loading />
            )}
        </main>
    )
}

export default withAuth(MasterCabang)