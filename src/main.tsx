import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import i18n from '@/i18n'
import { detectLanguage } from '@/i18n/detectLanguage'
import { AppProviders } from '@/app/providers'

const params = new URLSearchParams(window.location.search)
void i18n.changeLanguage(detectLanguage(params))
import { App } from '@/app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
