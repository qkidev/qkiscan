import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/home/HomePage'
import { BlocksPage } from '@/pages/blocks/BlocksPage'
import { BlockDetailPage } from '@/pages/blocks/BlockDetailPage'
import { TransactionsPage } from '@/pages/transactions/TransactionsPage'
import { TransactionDetailPage } from '@/pages/transactions/TransactionDetailPage'
import { AddressDetailPage } from '@/pages/addresses/AddressDetailPage'
import { TokensPage } from '@/pages/tokens/TokensPage'
import { TokenDetailPage } from '@/pages/tokens/TokenDetailPage'
import { TokenTransfersPage } from '@/pages/token-transfers/TokenTransfersPage'
import { SearchPage } from '@/pages/search/SearchPage'
import { StatsPage } from '@/pages/stats/StatsPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'blocks', element: <BlocksPage /> },
      { path: 'blocks/:heightOrHash', element: <BlockDetailPage /> },
      { path: 'txs', element: <TransactionsPage /> },
      { path: 'tx/:hash', element: <TransactionDetailPage /> },
      { path: 'address/:address', element: <AddressDetailPage /> },
      { path: 'tokens', element: <TokensPage /> },
      { path: 'token-transfers', element: <TokenTransfersPage /> },
      { path: 'token/:address', element: <TokenDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'stats', element: <StatsPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
])
