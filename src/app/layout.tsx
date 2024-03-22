import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Reason Score Editor',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const suppressHydrationWarning = process.env.NODE_ENV === "development" ? { suppressHydrationWarning: true } : {}
  return (
    <html lang="en">
        {/* add suppressHydrationWarning if dev */}
      <body className={inter.className} {...suppressHydrationWarning}> {children}</body>
    </html>
  )
}
