'use client';

import { useEffect } from 'react';
import {
    Bell,
    Settings,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User2 } from 'lucide-react';
import { User } from '@/models/User';
import { encrypt } from '@/lib/Encrypt';
import Link from 'next/link';

export default function HeaderComponent() {
    const profileMenuRef = useRef<HTMLButtonElement>(null);
    const [notifications] = useState(99);

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
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                }
            }
        }
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="text-lg font-semibold">Dashboard Admin</div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </Button>
                    {/* {notifications > 0 && (
                        <span className="absolute top-0 left-0 transform -translate-x-1 translate-y-0.5 inline-flex items-center justify-center px-1.5 h-[18px] min-w-[18px] text-[10px] font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                            +{notifications}
                        </span>
                    )} */}
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
                            onClick={() => console.log('Sign out clicked')}
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
