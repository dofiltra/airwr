/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from 'react-router-dom'
import { smiles } from 'helpers/smiles'
import { useContext } from 'react'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]
  const { user } = useContext(AuthContext)

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('AboutTitle')}
                    <img src={smileSrc} className="inline px-4" />
                  </h1>
                  <pre className="mb-5 justify-center  py-6">
                    {translate('RewritePrice')}
                  </pre>
                  {user && (
                    <p>
                      <Link to="/profile" className="btn">
                        {user?.displayName} | {user?.email}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
