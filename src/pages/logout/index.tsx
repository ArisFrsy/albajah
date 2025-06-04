'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Hapus data user dari localStorage
        localStorage.removeItem('user');

        // Redirect ke halaman login setelah logout
        router.push('/login');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Button disabled>Logging out...</Button>
        </div>
    );
}