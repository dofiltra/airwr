import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { FooterSmall, Root } from '@dofiltra/tailwind'
import { useLocalize } from '@borodutch-labs/localize-react'
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
            <FooterSmall
              siteName={'Dofiltra'}
              serviceItems={[
                <li className="bordered border-r-0 px-4">
                  <Link
                    to="/info/contacts"
                    className="hover:text-gray-400 text-sm font-semibold block py-1"
                  >
                    {'Contacts'}
                  </Link>
                </li>,
              ]}
            />
          </AuthContextProvider>
        </LocalizationProvider>
      </Root>
    </BrowserRouter>
  )
}

export default App
