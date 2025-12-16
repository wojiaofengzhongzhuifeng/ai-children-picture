import { ReactNode } from 'react'
import { Header } from '@/components/user/Header'
import { Footer } from '@/components/user/Footer'
import { Toaster } from '@/components/ui/toaster'

export default function UserLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
