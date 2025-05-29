"use client";
import withAuth from '@/components/withAuth';
import { Sidebar } from '@/components/Sidebar';

function index() {
    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto bg-gray-100">
                    <div className="overflow-x-auto">
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
                                    <a href="#" className="block transition-colors hover:text-gray-900"> Dashboard </a>
                                </li>

                            </ol>
                        </nav>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Dashboard</h1>
                        <p className="mt-2 text-gray-600 text-center ">Welcome to your dashboard!</p>
                        <br />
                    </div>
                </main>
            </div>
        </>
    );
}

export default withAuth(index);
