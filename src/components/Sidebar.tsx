'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';

export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/login');
    };

    const menus = [
        { name: 'Master Paket', path: '/master-paket' },
        { name: 'Master Sub Paket', path: '/master-sub-paket' },
        { name: 'Master Berita', path: '/master-berita' },
        { name: 'Master Region', path: '/master-region' },
        { name: 'Master Cabang', path: '/master-cabang' },
    ];

    return (
        <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white w-64">
            <div className="px-4 py-6">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
                    Logo
                </span>

                <ul className="mt-6 space-y-1">
                    {menus.map((item) => (
                        <li key={item.path}>
                            <button
                                onClick={() => router.push(item.path)}
                                className={clsx(
                                    'block w-full text-left rounded-lg px-4 py-2 text-sm font-medium',
                                    pathname === item.path
                                        ? 'bg-gray-100 text-gray-700 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                )}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        className="size-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-xs">
                            <strong className="block font-medium">Eric Frusciante</strong>
                            <span> eric@frusciante.com </span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
