import { auth } from 'services/firebase'
import { useLocalize } from '@borodutch-labs/localize-react'
import DefaultButton from './Button'

export const SignOutButton = () => {
  const { translate } = useLocalize()
  return (
    <DefaultButton
      onClick={() => auth.signOut()}
      title={translate('sign out').toUpperCase()}
    />
  )
}
