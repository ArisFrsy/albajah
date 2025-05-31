"use client";

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSubPaketPagination } from "./UseSubPaketPagination";
import { SubPaket } from "@/models/SubPaket";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Delete, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

function MasterSubPaket() {
    const router = useRouter();
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedSubPaket, setSelectedSubPaket] = useState<SubPaket | null>(null);

    const handleDelete = (subPaket: SubPaket) => {
        Swal.fire({
            title: 'Hapus Sub Paket',
            text: `Apakah Anda yakin ingin menghapus sub paket "${subPaket.namaSubPaket}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/api/master/sub-paket/${subPaket.idSubpaket}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                    .then((res) => res.json())
                    .then(() => {
                        Swal.fire('Berhasil', 'Sub paket berhasil dihapus.', 'success');
                        router.reload();
                    })
                    .catch((error) => {
                        console.error("Error deleting sub paket:", error);
                        Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus sub paket.', 'error');
                    });
            }
        });
    }

    const headers: Header<SubPaket>[] = [
        { column: "namaSubPaket", label: "Sub Paket", orderable: true, align: "left" },
        { column: "paket.nama", label: "Paket", orderable: true, align: "left" },
        { column: "hargaIDR", label: "IDR", orderable: true, align: "right" },
        { column: "hargaUSD", label: "USD", orderable: true, align: "right" },
        { column: "keberangkatan", label: "Keberangkatan", orderable: true, align: "left" },
        { column: "durasiHari", label: "Durasi", orderable: true, align: "right" },
        { column: "penerbangan", label: "Penerbangan", orderable: true, align: "left" },
        { column: "hotelMekkah", label: "Hotel Mekkah", orderable: true, align: "left" },
        { column: "hotelMadinah", label: "Hotel Madinah", orderable: true, align: "left" },
        { column: "fasilitas", label: "Fasilitas", orderable: false, align: "left" },
        { column: "perlengkapan", label: "Perlengkapan", orderable: false, align: "left" },
        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: SubPaket) => (
                <>
                    <Link href={`/master-subpaket/view/${row.idSubpaket}`} passHref>
                        <button
                            className="bg-blue-500 text-blue-700 font-semibold text-white py-1 px-2 border border-blue-500 border-transparent rounded mr-2"
                        >
                            <Eye size={16} className="inline" />
                        </button>
                    </Link>
                    <Link href={`/master-subpaket/edit/${row.idSubpaket}`} passHref>
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
    ]

    const {
        subPaket,
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
    } = useSubPaketPagination();


    return (<main className="flex-1 p-6 overflow-auto bg-gray-100">
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
                        <a href="#" className="block transition-colors hover:text-gray-900"> Master Sub Paket </a>
                    </li>
                </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Master Sub Paket</h1>
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
                        placeholder="Cari Sub Paket..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800 text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearch((e.target as HTMLInputElement).value);
                            }
                        }}
                    />
                </div>

                <Link href="/master-subpaket/tambah" passHref>
                    <div className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden">
                        <Plus className="inline mr-1" />
                        Tambah Data
                    </div>
                </Link>

            </div>

            <br />
            <div className="w-full overflow-x-auto">
                <DataTable
                    data={subPaket}
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
    </main>);
}

export default withAuth(MasterSubPaket);