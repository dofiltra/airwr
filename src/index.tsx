import './index.css'
import { App } from './App'
import { HostManager } from '@dofiltra/tailwind'
import { ModuleName } from 'dprx-types'
import { OdmBalancePage } from 'views/odm/balance'
import { OdmStatsPage } from 'views/odm/stats'
import { RewriterPage } from 'views/rewriter/Rewriter'
import { render } from 'preact'
import AboutPage from 'views/info/About'
import ApiPage from 'views/info/Api'
import ContactsPage from 'views/info/Contacts'
import ExtractorPage from 'views/extractor/Extractor'
import ExtractorResultPage from 'views/extractor/Result'
import FaqPage from 'views/info/Faq'
import ProfilePage from 'views/info/Profile'
import RewriterResultPage from 'views/rewriter/Result'
import TranslateResultPage from 'views/translator/Result'
import TranslatorPage from 'views/translator/Translator'
import en from './localization/locales/en.json'
import ru from './localization/locales/ru.json'

HostManager.build({
  env: import.meta.env,
  messages: {
    en,
    ru: { ...en, ...ru },
  },
})

const routes: { path: string; element: JSX.Element }[] = [
  { path: '/', element: <RewriterPage /> },
  {
    path: `/${ModuleName.Rewriter}/result/:id`,
    element: <RewriterResultPage />,
  },
  { path: '/rewrite/result/:id', element: <RewriterResultPage /> },
  { path: `/${ModuleName.Translator}`, element: <TranslatorPage /> },
  {
    path: `/${ModuleName.Translator}/result/:id`,
    element: <TranslateResultPage />,
  },
  { path: `/${ModuleName.Extractor}`, element: <ExtractorPage /> },
  {
    path: `/${ModuleName.Extractor}/result/:id`,
    element: <ExtractorResultPage />,
  },
  { path: '/odm/balance', element: <OdmBalancePage /> },
  { path: '/odm/stats', element: <OdmStatsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/info/api', element: <ApiPage /> },
  { path: '/info/about', element: <AboutPage /> },
  { path: '/info/contacts', element: <ContactsPage /> },
  { path: '/info/faq', element: <FaqPage /> },
]
render(<App routes={routes} />, document.getElementById('root') as Element)
