import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto WhatsApp Reply',
  description: 'Automated WhatsApp reply simulator with custom message management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
