import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "next-themes";
import { DesignSystemProvider } from '../components/DesignSystemProvider'

import { darkTheme } from "../stitches.config";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      value={{
        dark: darkTheme.className,
        light: "light",
      }}>
      <DesignSystemProvider>
        <Component {...pageProps} />
      </DesignSystemProvider>
    </ThemeProvider>
  );
}

export default MyApp
