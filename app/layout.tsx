import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlackMont Consulting | Business Strategy, AI & Operations Consulting',
  description: 'BlackMont Consulting helps CEOs, founders, and operations leaders in Pakistan and the GCC achieve measurable growth through strategic consulting, AI integration, and operational excellence.',
  keywords: 'business consulting Pakistan, GCC consulting firm, AI consulting, operations consulting, business strategy, logistics optimization, digital transformation, business process automation',
  authors: [{ name: 'BlackMont Consulting' }],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'BlackMont Consulting | Strategy, AI & Operations',
    description: 'Where strategy meets execution. Premium consulting for Pakistan and GCC businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlackMont Consulting',
    description: 'Business strategy, AI integration, and operations consulting for Pakistan and GCC markets.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}