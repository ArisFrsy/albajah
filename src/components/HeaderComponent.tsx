'use client';

import {
    Bell,
    User,
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

export default function HeaderComponent() {
    const profileMenuRef = useRef<HTMLButtonElement>(null);
    const [notifications] = useState(99);

    const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="text-lg font-semibold">Dashboard</div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </Button>
                    {notifications > 0 && (
                        <span className="absolute top-0 left-0 transform -translate-x-1 translate-y-0.5 inline-flex items-center justify-center px-1.5 h-[18px] min-w-[18px] text-[10px] font-bold leading-none text-white bg-red-500 rounded-full shadow-sm">
                            +{notifications}
                        </span>
                    )}
                </div>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            ref={profileMenuRef}
                            className="rounded-full ring-1 ring-gray-300 hover:ring-indigo-500 transition-all focus:outline-none"
                        >
                            <Avatar>
                                <AvatarImage src={userData.avatarUrl} alt="Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>

                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={userData.avatarUrl} />
                                    <AvatarFallback>{userData.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate">{userData.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                            <Settings className="w-4 h-4 text-gray-500" />
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => console.log('Sign out clicked')}
                        >
                            <LogOut className="w-4 h-4 text-red-500" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
