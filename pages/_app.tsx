import { AuthProvider } from '@/contexts/AuthContext'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
