/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DocumentationApi } from 'components/Documentation/Api'
import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="w-full">
            <div className="hero bg-base-200">
              <div className="text-center hero-content w-full">
                <div className="w-full">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ApiTitle')}
                  </h1>
                  {/* <p className="mb-5">{translate('ApiText')}</p> */}
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
