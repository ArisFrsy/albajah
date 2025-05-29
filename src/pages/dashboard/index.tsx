import withAuth from '@/components/withAuth';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DataTable } from '@/components/DataTable';

function index() {
    const router = useRouter();
    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto bg-gray-100">
                    <div className="overflow-x-auto">
                        <nav aria-label="Breadcrumb">
                            <ol className="flex items-center gap-1 text-sm text-gray-700">
                                <li>
                                    <a href="#" className="block transition-colors hover:text-gray-900"> Home </a>
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
                                    <a href="#" className="block transition-colors hover:text-gray-900"> Category </a>
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
                                    <a href="#" className="block transition-colors hover:text-gray-900"> Product </a>
                                </li>
                            </ol>
                        </nav>
                        <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">Dashboard</h1>
                        <p className="mt-2 text-gray-600 text-center ">Welcome to your dashboard!</p>
                        <br />
                        <div className="flex gap-4 sm:gap-6">
                            <details className="group relative">
                                <summary
                                    className="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
                                >
                                    <span className="text-sm font-medium"> Availability </span>

                                    <span className="transition-transform group-open:-rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </span>
                                </summary>

                                <div
                                    className="z-auto w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8"
                                >
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <span className="text-sm text-gray-700"> 0 Selected </span>

                                        <button
                                            type="button"
                                            className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    <fieldset className="p-3">
                                        <legend className="sr-only">Checkboxes</legend>

                                        <div className="flex flex-col items-start gap-3">
                                            <label htmlFor="Option1" className="inline-flex items-center gap-3">
                                                <input type="checkbox" className="size-5 rounded border-gray-300 shadow-sm" id="Option1" />

                                                <span className="text-sm font-medium text-gray-700"> Option 1 </span>
                                            </label>

                                            <label htmlFor="Option2" className="inline-flex items-center gap-3">
                                                <input type="checkbox" className="size-5 rounded border-gray-300 shadow-sm" id="Option2" />

                                                <span className="text-sm font-medium text-gray-700"> Option 2 </span>
                                            </label>

                                            <label htmlFor="Option3" className="inline-flex items-center gap-3">
                                                <input type="checkbox" className="size-5 rounded border-gray-300 shadow-sm" id="Option3" />

                                                <span className="text-sm font-medium text-gray-700"> Option 3 </span>
                                            </label>
                                        </div>
                                    </fieldset>
                                </div>
                            </details>

                            <details className="group relative">
                                <summary
                                    className="flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
                                >
                                    <span className="text-sm font-medium"> Price </span>

                                    <span className="transition-transform group-open:-rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </span>
                                </summary>

                                <div
                                    className="z-auto w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8"
                                >
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <span className="text-sm text-gray-700"> Max price is $600 </span>

                                        <button
                                            type="button"
                                            className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 p-3">
                                        <label htmlFor="MinPrice">
                                            <span className="text-sm text-gray-700"> Min </span>

                                            <input
                                                type="number"
                                                id="MinPrice"
                                                value="0"
                                                className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                                            />
                                        </label>

                                        <label htmlFor="MaxPrice">
                                            <span className="text-sm text-gray-700"> Max </span>

                                            <input
                                                type="number"
                                                id="MaxPrice"
                                                value="600"
                                                className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </details>
                        </div>
                        <br />
                        <DataTable />
                    </div>
                </main>
            </div>
        </>
    );
}

export default withAuth(index);
