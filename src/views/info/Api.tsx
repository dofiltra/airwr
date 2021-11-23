/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loading } from 'components/Base/Loader'
import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero  bg-base-200">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ApiTitle')}
                  </h1>
                  <p className="mb-5">{translate('ApiText')}</p>
                  <Loading />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
