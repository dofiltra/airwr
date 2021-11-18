import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RewriterPage } from 'views/rewriter/Rewriter'
import AuthContextProvider from 'components/Auth/AuthContextProvider'
import FooterSmall from 'components/Footer/FooterSmall'
import LocalizationProvider from 'localization/LocalizationProvider'
import Login from 'views/Login'
import Navbar from 'components/Navbar/Navbar'
import RewriterResultPage from 'views/rewriter/Result'
import Root from 'components/Root'

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
              <Route path="/login" element={<Login />} />
            </Routes>
            <FooterSmall />
          </AuthContextProvider>
        </LocalizationProvider>
      </Root>
    </BrowserRouter>
  )
}

export default App
