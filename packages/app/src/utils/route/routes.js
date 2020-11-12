import PhalaWalletPage from '@phala/wallet'
import AppSettingsPage from '@/components/SettingsPage'
import HelloWorldAppPage from '@phala/helloworld-app'
import TunaLedgerAppPage from '@phala/tunaledger-app'

export const COMPONENT_ROUTES = {
  wallet: PhalaWalletPage,
  settings: AppSettingsPage,
  helloworldapp: HelloWorldAppPage,
  tunaledgerapp: TunaLedgerAppPage
}

export const MENU_ROUTES = {
  WALLET: '/wallet',
  SETTINGS: '/settings',
  HELLOWORLDAPP: '/helloworldapp',
  TUNALEDGERAPP: '/tunaledgerapp'
}
