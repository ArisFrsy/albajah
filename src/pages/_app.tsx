import '../app/globals.css'  // sesuaikan pathnya

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
