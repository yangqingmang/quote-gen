import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Quote Generator - Free Quote Generator for Tradespeople',
  description: 'Generate professional quotes in seconds. For plumbers, electricians, HVAC, carpenters, and handymen. Free to use.',
  keywords: 'quote generator, free quote, plumbing estimate, electrician quote, handyman estimate, AI quote generator',
  openGraph: {
    title: 'AI Quote Generator for Tradespeople',
    description: 'Generate professional quotes in seconds. Free for plumbers, electricians, and handymen.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
