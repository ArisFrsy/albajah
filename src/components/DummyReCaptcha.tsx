'use client';

import { useEffect } from 'react';

type Props = {
    onChange: (token: string) => void;
};

export default function DummyReCaptcha({ onChange }: Props) {
    useEffect(() => {
        // Simulasikan delay seperti user mengisi captcha
        const timer = setTimeout(() => {
            onChange('dummy-token-verified');
        }, 1000); // 1 detik delay

        return () => clearTimeout(timer);
    }, [onChange]);

    return (
        <div style={{ padding: '10px', border: '1px dashed gray' }}>
            <p>🔐 Dummy reCAPTCHA aktif (development only)</p>
        </div>
    );
}
