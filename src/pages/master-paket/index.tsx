"use client";

import withAuth from "@/components/withAuth";
import { Sidebar } from "@/components/Sidebar";
import { DataTable } from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function MasterPaketPage() {
    const router = useRouter();
    const [pakets, setPaket] = useState([]);

    // useEffect(() => {
    //     async function fetchPaket() {
    //         const res = await fetch('/api/master-paket');
    //         const data = await res.json();
    //         setPaket(data.pakets);
    //     }
    //     fetchPaket();
    // }, []);

    return (
        <div className="flex h-screen ">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto bg-gray-100">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
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
                    <p className="mt-2 text-gray-600 text-center">Manage your packages here.</p>
                    <br />
                    <div className="flex justify-between items-center mb-4">
                        <a
                            className="inline-block rounded-sm border border-indigo-600 px-6 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
                            href="#"
                        >
                            Filter
                        </a>
                        <a
                            className="inline-block rounded-sm border border-indigo-600 px-6 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:ring-3 focus:outline-hidden"
                            href="#"
                        >
                            Tambah Data
                        </a>
                    </div>

                    <br />
                    <DataTable />
                </div>
            </main>
        </div>
    );
}

export default withAuth(MasterPaketPage);