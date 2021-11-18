/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLocalize } from '@borodutch-labs/localize-react'

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

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero  bg-base-200">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ContactsTitle')}
                  </h1>
                  <p className="mb-5">{translate('ContactsText')}</p>
                  <div className="text-center justify-center flex">
                    <img src={smileSrc} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
