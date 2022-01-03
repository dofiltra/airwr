import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OdmBalancePage } from 'views/odm/balance'
import { RewriterPage } from 'views/rewriter/Rewriter'
import AboutPage from 'views/info/About'
import ApiPage from 'views/info/Api'
import AuthContextProvider from 'components/Auth/AuthContextProvider'
import ContactsPage from 'views/info/Contacts'
import FaqPage from 'views/info/Faq'
import FooterSmall from 'components/Footer/FooterSmall'
import LocalizationProvider from 'localization/LocalizationProvider'
import Login from 'views/Login'
import Navbar from 'components/Navbar/Navbar'
import ProfilePage from 'views/info/Profile'
import RewriterResultPage from 'views/rewriter/Result'
import Root from 'components/Containers/Root'
import TranslatorPage from 'views/translator/Translator'

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <LocalizationProvider>
          <AuthContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<RewriterPage />} />
              <Route
                path="/rewrite/result/:id"
                element={<RewriterResultPage />}
              />
              <Route path="/translator" element={<TranslatorPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/odm/balance" element={<OdmBalancePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/info/api" element={<ApiPage />} />
              <Route path="/info/about" element={<AboutPage />} />
              <Route path="/info/contacts" element={<ContactsPage />} />
              <Route path="/info/faq" element={<FaqPage />} />
            </Routes>
            <FooterSmall />
          </AuthContextProvider>
        </LocalizationProvider>
      </Root>
    </BrowserRouter>
  )
}

export default App
