"use client";

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBeritaPagination } from "./UseBeritaPagination";
import { Berita } from "@/models/Berita";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Delete, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

function MasterBerita() {
    const router = useRouter();
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

    const handleDelete = (berita: Berita) => {
        Swal.fire({
            title: 'Hapus Berita',
            text: `Apakah Anda yakin ingin menghapus berita "${berita.judul}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/master/berita/${berita.idBerita}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then((res) => res.json())
                    .then(() => {
                        Swal.fire('Berhasil', 'Berita berhasil dihapus.', 'success');
                        router.reload();
                    })
                    .catch((error) => {
                        console.error("Error deleting berita:", error);
                        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus berita.', 'error');
                    });
            }
        });
    }

    const headers: Header<Berita>[] = [
        { column: "judul", label: "Judul", orderable: true, align: "left" },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: Berita) => (
                <>
                    <Link href={`/master-berita/view/${row.idBerita}`} passHref>
                        <button
                            className="bg-blue-500 text-blue-700 font-semibold text-white py-1 px-2 border border-blue-500 border-transparent rounded mr-2"
                        >
                            <Eye size={16} className="inline" />
                        </button>
                    </Link>
                    <Link href={`/master-berita/edit/${row.idBerita}`} passHref>
                        <button
                            className="bg-yellow-500 text-yellow-700 font-semibold text-white py-1 px-2 border border-yellow-500 border-transparent rounded mr-2"
                        >
                            <Edit size={16} className="inline" />
                        </button>
                    </Link>
                    <button
                        className="bg-red-500 text-red-700 font-semibold text-white py-1 px-2 border border-red-500 border-transparent rounded mr-2"
                        onClick={() => handleDelete(row)}
                    >
                        <Delete size={16} className="inline" />
                    </button>
                </>
            ),
        },
    ];

    const {
        berita,
        page,
        limit,
        setPage,
        setLimit,
        orderByField,
        setOrderByField,
        loading,
        setSearch
    } = useBeritaPagination();

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100" >
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
                            <a href="#" className="block transition-colors hover:text-gray-900"> Master Berita </a>
                        </li>
                    </ol>
                </nav>
                <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Master Berita</h1>
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
                            placeholder="Cari Berita..."
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                    </div>

                    <Link href="/master-berita/tambah" passHref>
                        <div className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden">
                            <Plus className="inline mr-1" />
                            Tambah Data
                        </div>
                    </Link>

                </div>

                <br />
                <div className="w-full overflow-x-auto">
                    <DataTable
                        data={berita}
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
            {
                loading && (
                    <Loading />
                )
            }
        </main >
    )
}

export default withAuth(MasterBerita);