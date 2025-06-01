'use client';

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCabangPagination } from "./UseCabangPagination";
import { Cabang } from "@/models/Cabang";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Delete, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import InsertCabangModal from "./InsertCabangModal";
import EditCabangModal from "./EditCabangModal";
import DetailCabangModal from "./DetailCabangModal";

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
                    <button
                        className="bg-blue-500 text-blue-700 font-semibold text-white py-1 px-2 border border-blue-500 border-transparent rounded mr-2 "
                        onClick={() => handleDetail(row)}
                    >
                        <Eye size={16} className="inline" />
                    </button>
                    <button
                        className="bg-green-500 text-green-700 font-semibold text-white py-1 px-2 border border-green-500 border-transparent rounded mr-2"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit size={16} className="inline" />
                    </button>
                    <button
                        className="bg-red-500 text-red-700 font-semibold text-white py-1 px-2 border border-red-500 border-transparent rounded mr-2"
                        onClick={() => handleDelete(row)}
                    >
                        <Delete size={16} className="inline" />
                    </button>
                </>
            ),
        },
    ]

    const handleInsert = async (data: { cabang: Cabang }) => {
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
                throw new Error('Failed to insert data');
            }

            Swal.fire({
                title: 'Success',
                text: 'Data berhasil ditambahkan',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            setShowModal(false);
            fetchCabang(); // Refresh the data after insertion
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat menambahkan data. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }

    const handleUpdate = async (data: { cabang: Cabang }) => {
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
                throw new Error('Failed to update data');
            }

            Swal.fire({
                title: 'Success',
                text: 'Data berhasil diperbarui',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            setShowModal(false);
            fetchCabang(); // Refresh the data after update
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Terjadi kesalahan saat memperbarui data. Silakan coba lagi.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
        setSelectedCabang(null); // Clear selected cabang after update
    }

    const handleDelete = (cabang: Cabang) => {
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: `Apakah Anda yakin ingin menghapus cabang ${cabang.penanggungjawab}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/master/cabang/${cabang.idCabang}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete data');
                    }

                    Swal.fire({
                        title: 'Berhasil',
                        text: 'Data berhasil dihapus',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });

                    fetchCabang(); // Refresh the data after deletion
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                }
            }
        });
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
                            placeholder="Cari Paket..."
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