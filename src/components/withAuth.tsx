'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import HeaderComponent from './HeaderComponent';
import { Toaster } from 'sonner';

export default function withAuth(Component: React.ComponentType) {
    return function ProtectedComponent(props: any) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (typeof window === "undefined" || !token) {
                // safe to access localStorage, window, etc.
                router.replace('/login');
            }

        }, [router]);

        return (
            <>
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 overflow-auto">
                        <HeaderComponent />
                        <Component {...props} />
                    </div>
                    <Toaster position="top-right" richColors />
                </div>
            </>
        )
    };
}
