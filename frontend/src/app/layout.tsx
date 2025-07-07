import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Blonks - Evolving ASCII Portrait NFTs',
  description: 'Mint your unique evolving ASCII portrait NFT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #49c5b6',
              },
              success: {
                iconTheme: {
                  primary: '#49c5b6',
                  secondary: '#000000',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#000000',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
