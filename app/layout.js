import { Cormorant_Garamond, Inter, Jost } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollTop from '@/components/ui/ScrollTop'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'GLOWW — Plant-Powered Wellness',
    template: '%s | GLOWW',
  },
  description:
    'GLOWW makes clean-label wellness simple — cold-pressed juices, tablets, powders, and oils like sea buckthorn and moringa, lab-tested and delivered pan India.',
  keywords: [
    'sea buckthorn juice',
    'moringa tablets',
    'wellness supplements India',
    'clean label supplements',
    'GLOWW wellness',
    'plant-based nutraceuticals',
  ],
  openGraph: {
    title: 'GLOWW — Plant-Powered Wellness',
    description: 'Nourish From Within, Daily',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${jost.variable}`}>
      <body>
        <Providers>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-jost), sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                borderRadius: '12px',
                background: '#0B1F17',
                color: '#fff',
              },
              success: { iconTheme: { primary: '#CBA135', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
