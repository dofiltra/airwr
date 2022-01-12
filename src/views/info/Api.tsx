/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocumentationApi } from 'components/Documentation/Api'
import { smiles } from 'helpers/smiles'
import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="w-full">
            <div className="hero">
              <div className="text-center hero-content w-full">
                <div className="w-full">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ApiTitle')}
                    <sup className="font-thin">v1.1</sup>
                    <img src={smileSrc} className="inline px-4" />
                  </h1>
                  <DocumentationApi />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
