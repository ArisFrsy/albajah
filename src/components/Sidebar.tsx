'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
    Package,
    PackageOpen,
    Newspaper,
    MapPin,
    Building2,
    LogOut,
    Home
} from 'lucide-react';

export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/login');
    };

    const menus = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Master Paket', path: '/master-paket', icon: Package },
        { name: 'Master Sub Paket', path: '/master-sub-paket', icon: PackageOpen },
        { name: 'Master Berita', path: '/master-berita', icon: Newspaper },
        { name: 'Master Region', path: '/master-region', icon: MapPin },
        { name: 'Master Cabang', path: '/master-cabang', icon: Building2 },
    ];

    return (
        <div className="flex h-screen flex-col justify-between border-e border-gray-200 bg-white w-64 shadow-sm">
            <div className="px-4 py-6">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-indigo-100 text-sm text-indigo-700 font-semibold mb-4">
                    MyApp Logo
                </span>

                <ul className="space-y-1">
                    {menus.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => router.push(item.path)}
                                    className={clsx(
                                        'flex items-center gap-3 w-full rounded-lg px-4 py-2 text-sm transition-all',
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    )}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {item.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <img
                        alt="User"
                        src="https://ui-avatars.com/api/?name=Eric+Frusciante"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900">Eric Frusciante</p>
                        <p className="text-xs text-gray-500">eric@frusciante.com</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-md transition"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};
