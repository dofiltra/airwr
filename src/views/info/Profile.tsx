/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SignInButtons } from 'components/Buttons/SignIn'
import { smiles } from 'helpers/smiles'
import { useContext } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import Pay from 'components/Pay/Pay'
import useRewritedCharsCount from 'hooks/useRewritedCharsCount'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  const { user } = useContext(AuthContext)
  const { history = {} } = useRewritedCharsCount(user?.uid || '')

  if (!user?.uid) {
    return (
      <div className="min-h-full">
        <div className="w-full ">
          <h1 className="text-center mb-5">Auth required</h1>
          <div className="text-center mb-5 justify-center flex">
            <SignInButtons />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full min-h-full">
        <h1 className="mb-5 py-4 text-5xl text-center font-bold">
          {translate('ProfileTitle')}
          <img src={smileSrc} className="inline px-4" />
        </h1>
        <div className="text-center mb-5 justify-center flex"></div>
        <p className="mb-5">
          <Pay />
        </p>
        {Object.keys(history).length && (
          <>
            <hr className="mb-5" />
            <p className="mb-5">{translate('RewriteStats')}</p>
            <pre className="p-2">{JSON.stringify(history, null, 4)}</pre>
          </>
        )}
      </div>
    </>
  )
}
