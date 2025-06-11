'use client';

import { useEffect } from 'react';
import {
    Bell,
    // Settings,
    LogOut,
} from 'lucide-react';
import { useState, useRef } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User2 } from 'lucide-react';
import { User } from '@/models/User';
import { encrypt } from '@/lib/Encrypt';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Pen, Trash, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // opsional untuk Bahasa Indonesia



export default function HeaderComponent() {
    const profileMenuRef = useRef<HTMLButtonElement>(null);
    // const [notifications] = useState(99);

    const fallbackUser: User = {
        id: 0,
        name: 'Guest User',
        email: '[No Email]',
        passwordHash: '',
        createdAt: new Date(),
    };

    const [userData, setUserData] = useState<User>(fallbackUser);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userDetail = localStorage.getItem('user');
            if (userDetail) {
                try {
                    const parsedUser = JSON.parse(userDetail);
                    setUserData(parsedUser);
                } catch {
                    toast.error('Failed to parse user data from localStorage. Please log in again.');

                }
            }
        }
    }, []);

    const [notifications, setNotifications] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Gagal ambil notifikasi');

                const data = await res.json();
                setNotifications(data);
                const unread = data.filter((n: any) => n.read_at === null); // eslint-disable-line @typescript-eslint/no-explicit-any
                setUnreadCount(unread.length);
            } catch {
                toast.error('Gagal ambil notifikasi');
            }
        };

        fetchNotifications();
    }, []);

    const handleReadNotification = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/read/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                )
            );
            setUnreadCount((prev) => prev - 1);
        } catch {
            toast.error('Gagal update status notifikasi');
        }
    };


    const handleMarkAllRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications/read-all`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
            toast.success('Semua notifikasi ditandai dibaca');
        } catch {
            toast.error('Gagal menandai semua notifikasi');
        }
    };

    const getIconAndColor = (type: string) => {
        switch (type) {
            case 'create':
                return { icon: <Plus className="text-green-600 w-4 h-4" />, color: 'bg-green-100' };
            case 'update':
                return { icon: <Pen className="text-yellow-600 w-4 h-4" />, color: 'bg-yellow-100' };
            case 'delete':
                return { icon: <Trash className="text-red-600 w-4 h-4" />, color: 'bg-red-100' };
            default:
                return { icon: <Info className="text-blue-600 w-4 h-4" />, color: 'bg-blue-100' };
        }
    };



    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="text-lg font-semibold">Dashboard Admin</div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 inline-flex items-center justify-center px-1.5 h-[18px] min-w-[18px] text-[10px] font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-72 max-h-96 overflow-y-auto">
                            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleMarkAllRead()}
                                className="text-sm text-indigo-600 font-semibold cursor-pointer"
                            >
                                Tandai semua sudah dibaca
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {notifications.length === 0 ? (
                                <div className="text-sm text-gray-500 p-3">Tidak ada notifikasi</div>
                            ) : (
                                <>
                                    {notifications.map((notif) => {
                                        const { icon, color } = getIconAndColor(notif.data.message.type);

                                        return (
                                            <div
                                                key={notif.id}
                                                className={`flex items-start gap-2 p-2 rounded-md ${color} my-1 `}
                                                onClick={() => handleReadNotification(notif.id)}
                                            >
                                                {icon}
                                                <div>
                                                    <p className="text-sm">{notif.data.message.message}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(notif.created_at), {
                                                            addSuffix: true,
                                                            locale: id, // gunakan locale Indonesia
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            ref={profileMenuRef}
                            className="rounded-full ring-1 ring-gray-300 hover:ring-indigo-500 transition-all focus:outline-none"
                        >
                            <User2 className="h-6 w-6 text-gray-600" />

                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-3">
                                <User2 className="w-8 h-8 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate">{userData.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2">
                            <Link href={`/profile/${encrypt(userData.id?.toString() || '0')}`} className="flex items-center gap-2 w-full">
                                <User2 className="w-4 h-4 text-gray-500" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="gap-2">
                            <Settings className="w-4 h-4 text-gray-500" />
                            Settings
                        </DropdownMenuItem> */}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                            <Link href="/logout" className="flex items-center gap-2 w-full">
                                <LogOut className="w-4 h-4 text-red-600" />
                                Sign Out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
