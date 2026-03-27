import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { SearchBar } from './SearchBar'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePreferenceStore } from '@/store/preferenceStore'

const chainName =
  typeof import.meta.env.VITE_APP_CHAIN_NAME === 'string' && import.meta.env.VITE_APP_CHAIN_NAME.length > 0
    ? import.meta.env.VITE_APP_CHAIN_NAME
    : 'Explorer'

export function Header() {
  const { t } = useTranslation('common')
  const mobileOpen = usePreferenceStore((s) => s.mobileMenuOpen)
  const setMobile = usePreferenceStore((s) => s.setMobileMenuOpen)

  const nav = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          clsx('rounded px-2 py-1 text-sm', isActive ? 'bg-surface-muted font-semibold' : 'hover:bg-surface-muted')
        }
        onClick={() => setMobile(false)}
      >
        {t('nav.home')}
      </NavLink>
      <NavLink
        to="/blocks"
        className={({ isActive }) =>
          clsx('rounded px-2 py-1 text-sm', isActive ? 'bg-surface-muted font-semibold' : 'hover:bg-surface-muted')
        }
        onClick={() => setMobile(false)}
      >
        {t('nav.blocks')}
      </NavLink>
      <NavLink
        to="/txs"
        className={({ isActive }) =>
          clsx('rounded px-2 py-1 text-sm', isActive ? 'bg-surface-muted font-semibold' : 'hover:bg-surface-muted')
        }
        onClick={() => setMobile(false)}
      >
        {t('nav.transactions')}
      </NavLink>
      <NavLink
        to="/tokens"
        className={({ isActive }) =>
          clsx('rounded px-2 py-1 text-sm', isActive ? 'bg-surface-muted font-semibold' : 'hover:bg-surface-muted')
        }
        onClick={() => setMobile(false)}
      >
        {t('nav.tokens')}
      </NavLink>
      <NavLink
        to="/token-transfers"
        className={({ isActive }) =>
          clsx('rounded px-2 py-1 text-sm', isActive ? 'bg-surface-muted font-semibold' : 'hover:bg-surface-muted')
        }
        onClick={() => setMobile(false)}
      >
        {t('nav.tokenTransfers')}
      </NavLink>
    </>
  )

  return (
    <header className="sticky top-0 z-40 min-w-0 overflow-x-clip border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="truncate text-lg font-semibold text-slate-900 dark:text-white">
              {chainName}
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:flex" />
            <button
              type="button"
              className="rounded-md border border-border px-2 py-1 text-sm sm:hidden"
              onClick={() => setMobile(!mobileOpen)}
              aria-expanded={mobileOpen}
            >
              Menu
            </button>
          </div>
        </div>
        <SearchBar />
        <nav className={clsx('flex-wrap gap-2 sm:flex', mobileOpen ? 'flex' : 'hidden')}>{nav}</nav>
        <div className="sm:hidden">
          <LanguageSwitcher className="w-full justify-between" />
        </div>
      </div>
    </header>
  )
}
