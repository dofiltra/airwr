import { auth } from 'services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { useEffect } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext, { User } from './AuthContext'

const AuthContextProvider: React.FC = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [user, setUser] = useState<null | User>(null)
  const { translate } = useLocalize()

  useEffect(() => {
    return onAuthStateChanged(auth, (im) => {
      setIsInitialized(true)
      setUser(im)
    })
  }, [])

  const getContent = useCallback(() => {
    if (!isInitialized) {
      return <div>{translate('loading')}</div>
    }

    return children
  }, [isInitialized, children, translate])

  return (
    <AuthContext.Provider value={{ user }}>{getContent()}</AuthContext.Provider>
  )
}

export default AuthContextProvider
