import './globals.css'
import { AuthProvider } from '@/components/AuthContext'
import { CartProvider } from '@/components/CartContext'

export const metadata = {
  title: 'My Store',
  description: 'Online Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}