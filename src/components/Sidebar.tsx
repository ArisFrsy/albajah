'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
    Package, PackageOpen, Newspaper, Building2, Home, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

export const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     router.replace('/login');
    // };

    const menus = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: Home
        },
        {
            name: 'Master Paket',
            path: '/master-paket',
            icon: Package,
            children: [
                {
                    name: 'Master Sub Paket',
                    path: '/master-subpaket',
                    icon: PackageOpen
                }
            ]
        },
        {
            name: 'Master Berita',
            path: '/master-berita',
            icon: Newspaper
        },
        {
            name: 'Master Cabang',
            path: '/master-cabang',
            icon: Building2
        }
    ];


    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
            >
                <Menu size={20} />
            </button>

            {/* Overlay for mobile sidebar */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/30 md:hidden"
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                'fixed z-50 md:static top-0 left-0 h-full bg-white border-r transition-transform duration-300',
                collapsed ? 'w-20' : 'w-64',
                isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            )}>
                <div className="flex flex-col justify-between h-full">
                    {/* Header */}
                    <div className="px-4 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className={clsx(
                                'grid place-content-center rounded-lg text-sm font-semibold text-green-700  h-14 transition-all duration-300',
                                collapsed ? 'w-10' : 'w-32'
                            )}>
                                {collapsed ? 'A' : <>
                                    <img src={"/images/logo_al-bahjah.png"} alt="Logo" className="h-12 w-12 text-green-600" />
                                </>}
                            </span>
                            <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-green-600 transition">
                                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            </button>
                        </div>

                        {/* Menu Items */}
                        <ul className="space-y-1">
                            {menus.map((item) => {
                                const isActive = pathname === item.path || (item.children?.some(c => c.path === pathname));
                                const Icon = item.icon;

                                return (
                                    <li key={item.path}>
                                        {/* Parent Item */}
                                        <button
                                            onClick={() => {
                                                if (item.path) router.push(item.path);
                                            }}
                                            className={clsx(
                                                'flex items-center w-full gap-3 rounded-lg px-4 py-2 text-sm transition-all',
                                                isActive
                                                    ? 'bg-green-50 text-green-700 font-semibold border-l-4 border-green-600'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
                                                collapsed && 'justify-center px-2'
                                            )}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            {!collapsed && item.name}
                                        </button>

                                        {/* Submenu */}
                                        {!collapsed && item.children && (
                                            <ul className="ml-8 mt-1 space-y-1">
                                                {item.children.map(sub => {
                                                    const isSubActive = pathname === sub.path;
                                                    const SubIcon = sub.icon;
                                                    return (
                                                        <li key={sub.path}>
                                                            <button
                                                                onClick={() => router.push(sub.path)}
                                                                className={clsx(
                                                                    'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-all',
                                                                    isSubActive
                                                                        ? 'bg-green-100 text-green-800 font-semibold'
                                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                                                )}
                                                            >
                                                                <SubIcon size={16} className="shrink-0" />
                                                                {sub.name}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-4">
                        {/* {!collapsed && (
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    alt="User"
                                    src="https://ui-avatars.com/api/?name=Eric+Frusciante"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Eric Frusciante</p>
                                    <p className="text-xs text-gray-500">eric@frusciante.com</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className={clsx(
                                'flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-md transition',
                                collapsed && 'justify-center px-2'
                            )}
                        >
                            <LogOut size={16} />
                            {!collapsed && 'Logout'}
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
};
