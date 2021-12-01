import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { DesignSystemProvider } from '../components/DesignSystemProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DesignSystemProvider>
      <Component {...pageProps} />
    </DesignSystemProvider>
  );
}

export default MyApp
