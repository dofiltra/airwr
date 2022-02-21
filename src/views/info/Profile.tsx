/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BalanceApi } from 'helpers/api'
import { SignInButtons } from 'components/Buttons/SignIn'
import { smiles } from 'helpers/smiles'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import Pay from 'components/Pay/Pay'
import useRewritedCharsCount from 'hooks/useRewritedCharsCount'
import { TaskStatus } from 'dprx-types'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  if (!token) {
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

  const { history = {}, queue={} } = useRewritedCharsCount(token)
  const [myPromoCode, setMyPromoCode] = useState('')
  const [myPromoError, setMyPromoError] = useState('')
  const [myPromoPercent, setMyPromoPercent] = useState(10)

  useEffect(() => {
    const loadPromo = async () => {
      const { code: loadedCode, percent } = await BalanceApi.getPromoCode(token)
      setMyPromoCode(loadedCode)
      setMyPromoPercent(percent)
    }
    void loadPromo()
  }, [token])

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

          <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              {translate('My queue (last 30 days)')}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <>
                  <hr className="mb-5" />
                  <h2 className="">Rewrite</h2>
                  <p className="mb-5 px-6">
                    NotStarted: {queue?.rewrite && queue?.rewrite[TaskStatus.NotStarted] || 0}<br/>
                    InProgress: {queue?.rewrite && queue?.rewrite[TaskStatus.InProgress] || 0}<br/>
                    Completed: {queue?.rewrite && queue?.rewrite[TaskStatus.Completed] || 0}<br/>
                  </p>
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              {translate('RewriteStats')}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <>
                  <hr className="mb-5" />
                  <p className="mb-5"></p>
                  <pre className="p-2">{JSON.stringify(history, null, 4)}</pre>
                </>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              {translate('My Promo Code')}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <>
                  <hr className="mb-5" />
                  {translate('Send promo code another users', {
                    percent: myPromoPercent,
                  })}
                  <div className="text-error">{translate(myPromoError)}</div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MY_PROMO_CODE"
                      value={myPromoCode}
                      onChange={(e: any) => {
                        const code = e.target.value
                          ?.toUpperCase()
                          .replaceAll(' ', '_')

                        setMyPromoCode(code)
                      }}
                      className={`w-full mb-2 input input-bordered ${
                        myPromoError
                          ? 'input-error'
                          : myPromoError === undefined
                          ? 'input-success'
                          : ''
                      }`}
                    />
                    <button
                      className={
                        'absolute top-0 right-0 rounded-l-none btn btn-primary'
                      }
                      onClick={() => {
                        void BalanceApi.setPromoCode(token, myPromoCode).then(
                          ({ set, error, exists }: any) => {
                            setMyPromoError(error)

                            if (!error && set?.code && !exists) {
                              alert('Successful!')
                            }
                          }
                        )
                      }}
                    >
                      {translate('Save')}
                    </button>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
