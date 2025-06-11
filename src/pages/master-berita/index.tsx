"use client";

import withAuth from "@/components/withAuth";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/router";
import { useState } from "react";
import { useBeritaPagination } from "@/hooks/UseBeritaPagination";
import { Berita } from "@/models/Berita";
import { Header } from "@/components/Header";
import Loading from "@/components/Spinner";
import { Eye, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { encrypt } from "@/lib/Encrypt";
import { confirmDialog } from "@/lib/confirm-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function MasterBerita() {
    const router = useRouter();
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const handleDelete = async (berita: Berita) => {
        const confirmed = await confirmDialog({
            title: "Konfirmasi Hapus",
            description: `Apakah Anda yakin ingin menghapus berita "${berita.judul}"?`,
            confirmText: "Hapus",
            cancelText: "Batal",
        });
        if (confirmed.confirmed) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/master/berita/${berita.idBerita}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    toast.error("Gagal menghapus berita. Pastikan tidak ada data terkait yang masih digunakan.");
                } else {
                    toast.success("Berita berhasil dihapus.");
                    router.reload();
                }
            } catch {
                toast.error("Terjadi kesalahan saat menghapus berita.");
            }
        }
    }

    function stripHtmlWithSpace(html: string): string {
        // Ganti <br> (atau <br/>) jadi spasi
        const cleanHtml = html.replace(/<br\s*\/?>/gi, ' ');
        const doc = new DOMParser().parseFromString(cleanHtml, 'text/html');
        return doc.body.textContent || "";
    }



    const headers: Header<Berita>[] = [
        { column: 'no', label: 'No', orderable: false, align: 'left' },
        { column: "judul", label: "Judul", orderable: true, align: "left" },
        {
            column: 'foto', label: 'Foto', orderable: false, align: 'left', render: (row: Berita) => (
                <img src={baseUrl + row.urlImage || '/images/no-image.png'} alt={row.urlImage} className="w-16 h-16 object-cover rounded" />
            )
        },
        // render dengan dangerouslySetInnerHTML dan limit 100 karakter
        {
            column: "deskripsi",
            label: "Deskripsi",
            orderable: true,
            align: "left",
            render: (row: Berita) => {
                const deskripsi = row.deskripsi ?? ""; // default ke string kosong jika undefined
                const strippedDeskripsi = stripHtmlWithSpace(deskripsi); // menghapus tag HTML

                return (
                    <>
                        {strippedDeskripsi.length > 100 ? strippedDeskripsi.substring(0, 100) + "..." : strippedDeskripsi}
                    </>
                );
            },
        }
        ,

        {
            column: 'actions', // this is allowed because we define 'actions' in Header<T>
            label: 'Actions',
            align: 'left',
            render: (row: Berita) => (
                <>
                    <div className="flex gap-2">

                        <Link href={`/master-berita/view/${encrypt(row.idBerita ? row.idBerita.toString() : '-')}`} passHref>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                                <Eye size={16} className="inline" />
                            </Button>
                        </Link>
                        <Link href={`/master-berita/edit/${encrypt(row.idBerita ? row.idBerita.toString() : '-')}`} passHref>
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
        setSearch,
        totalPage
    } = useBeritaPagination();

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-100" >
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300 min-h-[calc(110vh-7rem)]">
                <div className="flex justify-between items-center">
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
                                <a href="#" className="block transition-colors hover:text-gray-900 text-base"> Master Berita </a>
                            </li>
                        </ol>
                    </nav>

                    <Link href="/master-berita/tambah" passHref>
                        <div className="inline-block rounded-sm border border-green-600 px-6 py-2 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:outline-hidden">
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

                </div>
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
                        totalPages={totalPage}
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