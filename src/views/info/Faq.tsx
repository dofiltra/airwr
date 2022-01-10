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
          <div className="w-full">
            <h1 className="mb-5 text-5xl font-bold text-center">
              {translate('FAQ')}
            </h1>
            <p className="text-center justify-center flex pb-6">
              <img src={smileSrc} />
            </p>
            <p className="w-full">
              <pre className="mb-5 whitespace-pre-wrap">
                {translate('FaqText')}
              </pre>
            </p>
            <p className="text-center">
              <a
                href="/download/Rewritery_v7.zip"
                className="btn btn-info text-white"
              >
                {translate('PluginDownload')}
              </a>
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
