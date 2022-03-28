import { DoFirebase, Loading, User } from '@dofiltra/tailwind'
import { onAuthStateChanged } from 'firebase/auth'
import { useCallback, useState } from 'preact/compat'
import { useEffect } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from './AuthContext'
import React from 'preact/compat'

const AuthContextProvider: React.FC = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [user, setUser] = useState<null | User>(null)
  const { translate } = useLocalize()

  useEffect(() => {
    const auth = DoFirebase.auth()
    if (!auth) {
      return
    }
    return onAuthStateChanged(auth, (im) => {
      setIsInitialized(true)
      setUser(im)
    })
  }, [])

  const getContent = useCallback(() => {
    if (!isInitialized) {
      return (
        <div className="">
          <div className="justify-center flex">{translate('Loading')}</div>
          <Loading />
        </div>
      )
    }

    return children
  }, [isInitialized, children, translate])

  return (
    <AuthContext.Provider value={{ user }}>{getContent()}</AuthContext.Provider>
  )
}

export default AuthContextProvider
