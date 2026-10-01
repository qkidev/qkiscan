import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enBlock from '@/locales/en/block.json'
import enTx from '@/locales/en/tx.json'
import enAddress from '@/locales/en/address.json'
import enToken from '@/locales/en/token.json'
import enSearch from '@/locales/en/search.json'
import enStats from '@/locales/en/stats.json'

import zhCNCommon from '@/locales/zh-CN/common.json'
import zhCNHome from '@/locales/zh-CN/home.json'
import zhCNBlock from '@/locales/zh-CN/block.json'
import zhCNTx from '@/locales/zh-CN/tx.json'
import zhCNAddress from '@/locales/zh-CN/address.json'
import zhCNToken from '@/locales/zh-CN/token.json'
import zhCNSearch from '@/locales/zh-CN/search.json'
import zhCNStats from '@/locales/zh-CN/stats.json'

import zhTWCommon from '@/locales/zh-TW/common.json'
import zhTWHome from '@/locales/zh-TW/home.json'
import zhTWBlock from '@/locales/zh-TW/block.json'
import zhTWTx from '@/locales/zh-TW/tx.json'
import zhTWAddress from '@/locales/zh-TW/address.json'
import zhTWToken from '@/locales/zh-TW/token.json'
import zhTWSearch from '@/locales/zh-TW/search.json'
import zhTWStats from '@/locales/zh-TW/stats.json'

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    block: enBlock,
    tx: enTx,
    address: enAddress,
    token: enToken,
    search: enSearch,
    stats: enStats,
  },
  'zh-CN': {
    common: zhCNCommon,
    home: zhCNHome,
    block: zhCNBlock,
    tx: zhCNTx,
    address: zhCNAddress,
    token: zhCNToken,
    search: zhCNSearch,
    stats: zhCNStats,
  },
  'zh-TW': {
    common: zhTWCommon,
    home: zhTWHome,
    block: zhTWBlock,
    tx: zhTWTx,
    address: zhTWAddress,
    token: zhTWToken,
    search: zhTWSearch,
    stats: zhTWStats,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'home', 'block', 'tx', 'address', 'token', 'search', 'stats'],
  interpolation: { escapeValue: false },
})

export default i18n
