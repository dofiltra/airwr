import { LocalizationProvider as BaseLocalizationProvider } from '@borodutch-labs/localize-react'
import { FC } from 'preact/compat'
import { HostManager } from '@dofiltra/tailwind'
import { useSnapshot } from 'valtio'
import AppStore from '../stores/AppStore'
import Language from '../models/Language'

const LocalizationProvider: FC = ({ children }) => {
  const appStore = useSnapshot(AppStore)
  return (
    <BaseLocalizationProvider
      locale={appStore.language}
      defaultLocale={Language.ru}
      translations={HostManager.messages}
      disableCache
    >
      {children}
    </BaseLocalizationProvider>
  )
}

export default LocalizationProvider
