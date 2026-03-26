import { Outlet } from 'react-router-dom'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { Header } from './Header'
import { Footer } from './Footer'
import { useLanguageSync } from '@/hooks/useLanguage'

export function AppLayout() {
  useLanguageSync()
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
      <GoogleAnalytics />
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
