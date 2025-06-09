'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Spinner from '@/components/Spinner' // Asumsi komponen ini ada
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OtpModal } from '@/hooks/OtpModal' // Asumsi komponen ini ada
import { toast, Toaster } from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'



// Skema form Zod tidak berubah
const formSchema = z.object({
    email: z.string().email({ message: 'Format email tidak valid.' }),
    password: z
        .string()
        .min(1, 'Password harus memiliki minimal 1 karakter.'),
})

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loginEmail, setLoginEmail] = useState('')
    const [counter, setCounter] = useState(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // --- Semua fungsi logika (onSubmit, handleVerifyOtp, etc.) tetap sama ---
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const captcha = recaptchaRef.current?.getValue()
        if (!captcha) {
            toast.error('Silakan selesaikan CAPTCHA terlebih dahulu.')
            return;
        }
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            const resData = await res.json()
            if (res.ok && resData.success) {
                localStorage.setItem('token', resData.token)
                localStorage.setItem('user', JSON.stringify(resData.user))
                setLoginEmail(values.email)
                setIsModalOpen(true)
                setCounter(0)
            } else {
                throw new Error(resData.message || 'Login gagal')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login.';
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (otp: string) => {
        setLoading(true)
        setCounter((prev) => prev + 1)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, code: otp })
            })
            const resData = await res.json()
            if (res.ok && resData.success) {
                localStorage.setItem('token', resData.token)
                toast.success('Verifikasi Berhasil! Mengarahkan ke dashboard...');
                router.push('/dashboard')
            } else {
                toast.error(resData.message || 'Verifikasi gagal')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat verifikasi.';
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (counter > 3) {
            toast.error('Anda telah mencoba verifikasi sebanyak 3 kali. Silakan coba lagi nanti.');
            setIsModalOpen(false)
        }
    }, [counter])

    const handleResendOtp = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login/resend-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail }),
            });
            const resData = await res.json()
            if (res.ok && resData.success) {
                toast.success('Kode OTP baru telah dikirim.');
                setCounter(0)
            } else {
                toast.error(resData.message || 'Gagal mengirim ulang OTP')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim ulang OTP.';
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <Head>
                <title>Sign In | My App</title>
            </Head>

            <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden">

                    {/* Kolom Kiri: Form Login */}
                    <div className="p-8 md:p-12">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                            <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
                        </div>


                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="admin@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Password</FormLabel>
                                                {/* <Link href="#" className="text-sm font-medium text-green-600 hover:underline">
                                                    Forgot Password?
                                                </Link> */}
                                            </div>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={'6LeNi04rAAAAAASa2iwBAbTXjRLNIT3dsIXMZ05s'}
                                    className="flex justify-center"
                                />
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                                    {loading ? 'Memproses...' : 'Sign In'}
                                </Button>
                                {/* <p className="text-center text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <Link href="#" className="font-medium text-green-600 hover:underline">
                                        Sign Up
                                    </Link>
                                </p> */}
                            </form>
                        </Form>
                    </div>

                    {/* Kolom Kanan: Kartu Welcome (dengan warna hijau) */}
                    <div className="hidden lg:flex flex-col items-center justify-center bg-green-50 p-12 text-center border-l">
                        <div className="flex items-center mb-6">
                            {/* <Blocks className="h-12 w-12 text-green-600" /> */}
                            <img src={"/images/logo_al-bahjah.png"} alt="Logo" className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Welcome Back!</h3>
                        <p className="text-gray-600 mt-2 max-w-sm">
                            Please sign in to your account by completing the necessary fields on the left.
                        </p>
                    </div>

                </div>

                {/* Modal dan komponen lainnya tetap di luar grid */}
                <OtpModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    onVerify={handleVerifyOtp}
                    onResend={handleResendOtp}
                />
                <Toaster position="top-right" richColors />
                {loading && <Spinner />}
            </div>
        </>
    )
}