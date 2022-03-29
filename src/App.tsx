import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FooterSmall, Root } from '@dofiltra/tailwind'
import AuthContextProvider from 'components/Auth/AuthContextProvider'
import LocalizationProvider from 'localization/LocalizationProvider'
import Navbar from 'components/Navbar/Navbar'

export const App = ({
  routes,
}: {
  routes: { path: string; element: JSX.Element }[]
}) => {
  return (
    <BrowserRouter>
      <Root>
        <LocalizationProvider>
          <AuthContextProvider>
            <Navbar />
            <Routes>
              {routes.map((route) => {
                return <Route path={route.path} element={route.element} />
              })}
            </Routes>
            {/* <FooterSmall siteName={'Dofiltra'} contactsText={'Contacts'} /> */}
          </AuthContextProvider>
        </LocalizationProvider>
      </Root>
    </BrowserRouter>
  )
}

export default App
