import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/app/components/cart';
import { CustomerAuthProvider } from '@/app/components/auth/CustomerAuthProvider';
import { SimplifiedProvider } from '@/app/components/simplified/SimplifiedProvider';
import { isSimplifiedMode } from '@/lib/config/simplified';

export const runtime = 'edge';

// Single clean font for minimal design
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bebanway.com'),
  title: {
    default: 'Beban Way Market',
    template: '%s | Beban Way Market',
  },
  description:
    'Premium supermarket in Nineveh, Iraq. Fresh produce, dairy, rice, and quality goods. Open 9 AM - 12 AM daily.',
  keywords: [
    'supermarket',
    'Nineveh',
    'Iraq',
    'grocery',
    'fresh produce',
    'rice',
    'Beban',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Beban Way Market',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const simplified = isSimplifiedMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SimplifiedProvider simplified={simplified}>
          <CustomerAuthProvider>
            <CartProvider>{children}</CartProvider>
          </CustomerAuthProvider>
        </SimplifiedProvider>
      </body>
    </html>
  );
}
