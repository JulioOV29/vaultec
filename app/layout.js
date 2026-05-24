import { Geist } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Vaultec',
  description: 'Sistema de Gestión de Activos Tecnológicos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}