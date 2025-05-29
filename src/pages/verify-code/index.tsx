'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Spinner from '@/components/Spinner';


export default function VerifyCodePage() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Ambil email dari token di localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            setEmail(decoded.email);
        } catch (err) {
            console.error('Invalid token');
            localStorage.removeItem('token');
            router.replace('/login');
        }
    }, [router]);

    const handleVerify = async () => {
        setLoading(true);
        setError('');

        const res = await fetch('/api/login/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ email, code }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Invalid or expired code');
            setLoading(false);
            return;
        }

        router.replace('/dashboard');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            {loading && <Spinner />}
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Verify Code</h1>
                <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code sent to your email
                </p>

                <input
                    type="text"
                    placeholder="6-digit code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    maxLength={6}
                    className="w-full mb-4 px-4 py-2 border rounded text-gray-900 focus:outline-none focus:ring focus:border-blue-300"
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
            </div>
        </div>
    );
}
