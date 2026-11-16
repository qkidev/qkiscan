import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom'
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

const routes = [
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
      { path: 'stats', element: <StatsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]

/** IPFS 网关没有路径回退，部署到 IPFS 时用 hash 路由；正式站仍用浏览器历史路径。 */
export const router =
  import.meta.env.VITE_APP_IPFS === 'true' ? createHashRouter(routes) : createBrowserRouter(routes)
