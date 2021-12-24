/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SignInButtons } from 'components/Buttons/SignIn'
import { useContext } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import Pay from 'components/Pay/Pay'
import useRewritedCharsCount from 'hooks/useRewritedCharsCount'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = [
    '/img/type.gif',
    '/img/d_clock.gif',
    '/img/MG_76.gif',
    '/img/MG_216.gif',
    '/img/phil_24.gif',
    '/img/LorDeR_ahgm.gif',
    '/img/Cherna-kunst.gif',
    '/img/kattemad_03.gif',
    '/img/KidRock_06.gif',
    '/img/kuzya_02.gif',
    '/img/bath.gif',
  ].sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

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
      <div className="min-h-full">
        <main>
          <div className="w-full ">
            <div className="">
              <div className="w-full">
                <h1 className="mb-5 py-4 text-5xl text-center font-bold">
                  {translate('ProfileTitle')}
                </h1>
                <div className="text-center mb-5 justify-center flex">
                  <img src={smileSrc} />
                </div>
                {/* <hr className="mb-5" /> */}
                {/* <p className="mb-5">{translate('Balance', { coins })}</p> */}
                <p className="mb-5">
                  <Pay />
                </p>
                <hr className="mb-5" />
                <p className="mb-5">{translate('RewriteStats')}</p>
                <pre>{JSON.stringify(history, null, 4)}</pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
