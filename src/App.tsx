import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthContextProvider from 'components/Auth/AuthContextProvider'
import FooterSmall from 'components/Footer/FooterSmall'
import LocalizationProvider from 'localization/LocalizationProvider'
import Login from 'views/Login'
import MainPage from 'views/Main'
import Navbar from 'components/Navbar/Navbar'
import Root from 'components/Root'

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <LocalizationProvider>
          <AuthContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <FooterSmall transparent />
          </AuthContextProvider>
        </LocalizationProvider>
      </Root>
    </BrowserRouter>
  )
}

export default App
