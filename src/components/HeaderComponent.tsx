'use client';

import { Bell } from 'lucide-react';
import PageTitle from './PageTitle';

export default function HeaderComponent() {


    return (
        <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
            <PageTitle />
            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <button
                    className="relative text-gray-600 hover:text-indigo-600 focus:outline-none"
                    aria-label="Notifications"
                >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                </button>

                {/* Optional: Avatar or Profile */}
                {/* <div className="w-8 h-8 rounded-full bg-gray-300" /> */}
            </div>
        </header>
    );
}
