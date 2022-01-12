/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { smiles } from 'helpers/smiles'
import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ContactsTitle')}
                    <img src={smileSrc} className="inline px-4" />
                  </h1>
                  <p className="mb-5">{translate('ContactsText')}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
