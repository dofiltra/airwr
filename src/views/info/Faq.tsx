/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { smiles } from '@dofiltra/tailwind'
import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="w-full">
            <h1 className="mb-5 text-5xl font-bold text-center">
              {translate('FAQ')}
              <img src={smileSrc} className="inline px-4" />
            </h1>
            <p className="w-full">
              <pre className="mb-5 whitespace-pre-wrap">
                {translate('FaqText')}
              </pre>
            </p>
            <p className="text-center">
              <a
                href="/download/Rewritery_v9.zip"
                className="btn btn-info text-white"
              >
                {translate('PluginDownload')} (v9)
              </a>
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
