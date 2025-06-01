'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import Head from 'next/head'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { OtpModal } from './OtpModal'
import { Toaster } from 'sonner'
// Hapus 'Label' dari 'ui/label', karena kita akan pakai dari 'ui/form'
// import { Label } from '@/components/ui/label'

// Impor komponen Form dari shadcn/ui
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { set } from 'date-fns'

// Skema form tidak berubah, sudah benar
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

    // 1. Inisialisasi form menggunakan `useForm` dari react-hook-form
    // Ini adalah pola yang direkomendasikan shadcn
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // 2. Fungsi onSubmit sekarang menerima `values` dari form
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form data:', values)
        const captcha = recaptchaRef.current?.getValue()

        // if (!captcha) {
        //     // Swal.fire({
        //     //     icon: 'warning',
        //     //     title: 'Captcha belum terverifikasi',
        //     //     text: 'Silakan verifikasi captcha sebelum melanjutkan.',
        //     // })
        //     return
        // }

        setLoading(true)

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Kirim `values` langsung
                body: JSON.stringify(values),
            })

            const resData = await res.json()

            if (res.ok && resData.success) {
                localStorage.setItem('token', resData.token)
                localStorage.setItem('user', JSON.stringify(resData.user))
                setLoginEmail(values.email)
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Login berhasil!',
                //     text: 'Anda akan diarahkan...',
                // })
                // router.push('/verify-code')

                setIsModalOpen(true) // Buka modal OTP jika login sukses
            } else {
                throw new Error(resData.message || 'Login gagal')
            }
        } catch (error: any) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Login Gagal',
            //     text: error.message || 'Terjadi kesalahan saat login.',
            // })
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (otp: string) => {
        setLoading(true)
        try {
            const res = await fetch('/api/login/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginEmail, // Kirim email yang sudah disimpan
                    code: otp          // Gunakan key 'code' sesuai permintaan
                })
            })

            const resData = await res.json()

            if (res.ok && resData.success) {
                localStorage.setItem('token', resData.token)
                localStorage.setItem('user', JSON.stringify(resData.user))
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Verifikasi Berhasil',
                //     text: 'Anda akan diarahkan...',
                // })
                router.push('/dashboard')
            } else {
                throw new Error(resData.message || 'Verifikasi gagal')
            }
        } catch (error: any) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Verifikasi Gagal',
            //     text: error.message || 'Terjadi kesalahan saat verifikasi.',
            // })
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/login/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const resData = await res.json()

            if (res.ok && resData.success) {
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Kode OTP baru telah dikirim.',
                // })
            } else {
                throw new Error(resData.message || 'Gagal mengirim ulang OTP')
            }
        } catch (error: any) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Gagal Mengirim Ulang OTP',
            //     text: error.message || 'Terjadi kesalahan saat mengirim ulang OTP.',
            // })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Login | My App</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-muted px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Masukkan email dan password untuk masuk ke akun Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* 3. Bungkus form dengan komponen <Form> dari shadcn */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* 4. Gunakan <FormField> untuk setiap input */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    // placeholder="contoh@email.com"
                                                    {...field}
                                                />
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
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    // placeholder="******"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={
                                        '6LeNi04rAAAAAASa2iwBAbTXjRLNIT3dsIXMZ05s'
                                    }
                                    className="mx-auto"
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? 'Memproses...' : 'Login'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
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