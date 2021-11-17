import { GoogleAuthProvider, signInWithRedirect } from '@firebase/auth'
import { auth } from 'services/firebase'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'

export const SignInButtons = () => {
  const { translate } = useLocalize()

  return (
    <>
      <button
        className="justify-center px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
        onClick={() => {
          const provider = new GoogleAuthProvider()
          auth.languageCode = AppStore.language

          signInWithRedirect(auth, provider)
            .then((x) => console.log(x))
            .catch((e) => console.log(e))
        }}
        style={{ transition: 'all .15s ease' }}
      >
        <img alt="..." className="w-5 mr-1" src={'/img/google.svg'} />
        {translate('sign in').toUpperCase()}
      </button>
    </>
  )
}
