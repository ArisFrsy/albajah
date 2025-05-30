'use client';

import {
    Bell,
    Maximize2,
    Sun,
    Globe2,
    User,
    Settings,
    LogOut,
} from 'lucide-react';
import { useState, useEffect, useRef, RefObject } from 'react';
import PageTitle from './PageTitle'; // Pastikan file ini ada

// Type alias untuk callback
type Callback = () => void;

// Hook custom untuk mendeteksi klik di luar elemen
function useOutsideAlerter(
    ref: RefObject<HTMLElement | null>,
    callback: Callback
): void {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}


export default function HeaderComponent() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);


    useOutsideAlerter(profileMenuRef, () => setIsProfileMenuOpen(false));

    // Dummy user data
    const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
    };

    const iconButtonClass =
        'p-1.5 text-gray-500 hover:text-gray-800 focus:outline-none rounded-full hover:bg-gray-100 transition-colors duration-150';
    const iconProps = { size: 22, strokeWidth: 1.5 };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Left section (title or spacer) */}
            <div className="min-w-[150px]">
                {/* Uncomment this to show PageTitle */}
                {/* <PageTitle /> */}
            </div>
            <div className="flex items-center gap-x-2 sm:gap-x-3">
                {/* Notifikasi */}
                <div className="relative">
                    <button className={iconButtonClass} aria-label="Notifications">
                        <Bell {...iconProps} />
                    </button>
                    <span className="absolute top-0 left-0 inline-flex items-center justify-center px-1.5 h-[18px] min-w-[18px] text-[10px] font-bold leading-none text-white bg-red-500 rounded-full shadow-sm transform -translate-x-1 translate-y-0.5">
                        +99
                    </span>
                </div>

                {/* Avatar dan Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="focus:outline-none rounded-full"
                        aria-label="User menu"
                        aria-expanded={isProfileMenuOpen}
                        id="user-menu-button"
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-300 hover:ring-indigo-500 transition-all"
                            src={userData.avatarUrl}
                            alt="User avatar"
                        />
                    </button>

                    {isProfileMenuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-xl overflow-hidden z-20 ring-1 ring-black ring-opacity-5 py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu-button"
                        >
                            <div className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={userData.avatarUrl}
                                        alt="User avatar"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {userData.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {userData.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                                role="menuitem"
                            >
                                <User size={18} className="text-gray-400" />
                                Profile
                            </a>
                            <a
                                href="#settings"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                                role="menuitem"
                            >
                                <Settings size={18} className="text-gray-400" />
                                Settings
                            </a>
                            <div className="border-t border-gray-100 my-1 mx-1" />
                            <a
                                href="#signout"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                role="menuitem"
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Sign out clicked');
                                    setIsProfileMenuOpen(false);
                                }}
                            >
                                <LogOut size={18} className="text-red-500" />
                                Sign out
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
