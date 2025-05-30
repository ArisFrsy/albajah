"use client";

import withAuth from "@/components/withAuth";
import { Sidebar } from "@/components/Sidebar";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePaketPagination } from "./UsePaketPagination";
import { Paket } from "@/models/Paket";
import { Header } from "@/components/Header";
import InsertPaketModal from "./InsertPaketModal";
import Loading from "@/components/Spinner";
import DetailPaketModal from "./DetailPaketModal";
import EditPaketModal from "./EditPaketModal";
import { Eye, Edit, Delete } from "lucide-react";

function MasterPaketPage() {
    const router = useRouter();
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
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

    const { paket, page, limit, setPage, setLimit, orderByDirection, setOrderByDirection, orderByField, setOrderByField, fetchPaket, loading, setLoading } = usePaketPagination();

    const headers: Header<Paket>[] = [
        // { column: 'idPaket', label: 'ID PAKET', orderable: true, align: 'left' },
        { column: 'nama', label: 'Nama Paket', orderable: true, align: 'left' },
        { column: 'deskripsi', label: 'Deskripsi', orderable: false, align: 'left' },
        {
            column: 'actions', label: 'Foto', orderable: false, align: 'left', render: (row: Paket) => (
                <img src={row.pathFoto || '/images/no-image.png'} alt={row.nama} className="w-16 h-16 object-cover rounded" />
            )
        },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: Paket) => (
                <>
                    <button
                        className="text-indigo-600 hover:underline mx-1"
                        onClick={() => handleDetail(row)}
                    >
                        <Eye size={16} className="inline" />
                    </button>
                    <button
                        className="text-blue-600 hover:underline mx-1"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit size={16} className="inline" />
                    </button>
                    <button
                        className="text-red-600 hover:underline mx-1"
                        onClick={() => handleDelete(row)}
                    >
                        <Delete size={16} className="inline" />
                    </button>
                </>
            ),
        },
    ]


    const handleInsert = async (data: { nama: string; deskripsi?: string, fileFoto?: File | null }) => {
        try {
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

            const res = await fetch('/api/master/paket', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            })
            setLoading(false);
            if (!res.ok) throw new Error('Failed to insert')
            fetchPaket();
            // Optionally refresh list here
        } catch (err) {
            console.error('Error inserting:', err)
            setLoading(false);
        }
    }


    const handleUpdate = async (data: { idPaket: number; nama: string; deskripsi?: string; fileFoto?: File | null }) => {
        try {
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

            const res = await fetch(`/api/master/paket`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            })
            setLoading(false);
            if (!res.ok) throw new Error('Failed to update')
            fetchPaket();
        } catch (err) {
            console.error('Error updating:', err)
            setLoading(false);
        }
    }

    const handleDelete = async (data: { idPaket: number }) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/master/paket`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id: data.idPaket }),
            })
            setLoading(false);
            if (!res.ok) throw new Error('Failed to delete')
            fetchPaket();
        } catch (err) {
            console.error('Error deleting:', err)
            setLoading(false);
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
                            <a href="#" className="block transition-colors hover:text-gray-900"> Master Paket </a>
                        </li>
                    </ol>
                </nav>
                <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Master Paket</h1>
                {/* line separator */}
                <hr className="my-4 border-gray-300" />
                <br />
                <div className="flex justify-between items-center mb-4">
                    <a
                        className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden"
                        href="#"
                    >
                        Filter
                    </a>
                    <a
                        className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden"
                        onClick={() => setShowModal(true)}
                    >
                        Tambah Data
                    </a>
                </div>

                <br />
                <div className="w-full overflow-x-auto">
                    <DataTable
                        data={paket}
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