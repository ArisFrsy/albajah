// components/OtpModal.tsx

'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'

// Definisikan tipe props untuk komponen ini
interface OtpModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onVerify: (otp: string) => Promise<void> // Fungsi yang dipanggil saat verifikasi
    onResend: () => Promise<void> // Fungsi untuk kirim ulang OTP
}

// Skema validasi menggunakan Zod
const FormSchema = z.object({
    pin: z.string().min(6, {
        message: 'Kode OTP harus berisi 6 digit.',
    }),
})

export function OtpModal({ isOpen, setIsOpen, onVerify, onResend }: OtpModalProps) {
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [isTimerActive, setIsTimerActive] = useState(true)

    // Efek untuk timer hitung mundur
    useEffect(() => {
        if (!isTimerActive) return

        if (countdown === 0) {
            setIsTimerActive(false)
            return
        }

        const timerId = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        // Cleanup function
        return () => clearTimeout(timerId)
    }, [countdown, isTimerActive])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: '',
        },
    })

    // Fungsi yang dijalankan saat form disubmit
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        try {
            await onVerify(data.pin)
            // Jika sukses, parent component akan menutup modal
        } catch (error: any) {
            toast.error('Verifikasi Gagal', {
                description: error.message || 'Kode OTP yang Anda masukkan salah.',
            })
        } finally {
            setLoading(false)
        }
    }

    // Fungsi untuk handle kirim ulang kode
    async function handleResendCode() {
        try {
            await onResend()
            toast.success('Kode OTP baru telah dikirim.')
            setCountdown(60) // Reset timer
            setIsTimerActive(true) // Aktifkan kembali timer
        } catch (error: any) {
            toast.error('Gagal Mengirim Ulang', {
                description: error.message || 'Terjadi kesalahan, coba lagi nanti.',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Verifikasi Akun Anda</DialogTitle>
                    <DialogDescription>
                        Kami telah mengirimkan kode 6 digit ke email Anda. Silakan masukkan
                        kode di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center space-y-4 flex-col">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode OTP</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Memverifikasi...' : 'Verifikasi'}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center text-sm text-muted-foreground">
                        {isTimerActive ? (
                            <span>
                                Kirim ulang kode dalam {countdown} detik
                            </span>
                        ) : (
                            <button
                                onClick={handleResendCode}
                                className="underline underline-offset-2 hover:text-primary"
                            >
                                Tidak menerima kode? Kirim ulang
                            </button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}