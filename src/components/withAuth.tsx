'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

        return <Component {...props} />;
    };
}
