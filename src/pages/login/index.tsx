'use client';

import { useState, useRef } from 'react'
import Head from 'next/head'
// import ReCAPTCHA from 'react-google-recaptcha'
import DummyReCaptcha from '../../components/DummyReCaptcha';
import { useRouter } from 'next/router';


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [captchaToken, setCaptchaToken] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!captchaToken) {
            alert('Captcha belum terverifikasi');
            return;
        }

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()
        setMessage(data.message)
        if (data.success) {
            localStorage.setItem('token', data.token)
            // Redirect or navigate...
            router.push('/verify-code'); // Ganti dengan rute yang sesuai
        }
    }

    function onRecaptchaChange(value: string | null) {
        console.log("Captcha value:", value);
    }


    return (
        <>
            <Head>
                <title>Login | My App</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white to-indigo-100">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-300">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Welcome</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            {/* <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={SITE_KEY}
                                onChange={onRecaptchaChange}
                            /> */}
                            <DummyReCaptcha onChange={(token) => setCaptchaToken(token)} />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl hover:bg-indigo-700 transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {message && (
                        <div className="mt-4 text-sm text-center text-red-600 font-medium">{message}</div>
                    )}

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a
                            href="#"
                            className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
