import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { StoreProvider } from '@/context/StoreContext';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
    title: 'Go Cart',
    description: 'GoCart. - Shop smart',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <CartProvider>
                <StoreProvider>
                    <html lang="en" suppressHydrationWarning>
                        <body className={`${outfit.className} antialiased`}>
                            {children}
                            <Toaster />
                        </body>
                    </html>
                </StoreProvider>
            </CartProvider>
        </AuthProvider>
    );
}
