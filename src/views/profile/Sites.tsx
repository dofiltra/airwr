/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BalanceApi, SignInButtons } from '@dofiltra/tailwind'
import { TaskStatus } from 'dprx-types'
import { smiles } from '@dofiltra/tailwind'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import Pay from 'components/Pay/Pay'
import useRewritedCharsCount from 'hooks/useRewritedCharsCount'

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
            <SignInButtons signInText={translate('sign in')} />
          </div>
        </div>
      </div>
    )
  }

  // const { history = {}, queue = {} } = useRewritedCharsCount(token)
  // const [myPromoCode, setMyPromoCode] = useState('')
  // const [myPromoError, setMyPromoError] = useState('')
  // const [myPromoPercent, setMyPromoPercent] = useState(10)

  // useEffect(() => {
  //   const loadPromo = async () => {
  //     const { code: loadedCode, percent } = await BalanceApi.getPromoCode(token)
  //     setMyPromoCode(loadedCode)
  //     setMyPromoPercent(percent)
  //   }
  //   void loadPromo()
  // }, [token])

  return (
    <>
      <div className="w-full min-h-full">
        <h1 className="mb-5 py-4 text-5xl text-center font-bold">
          {translate('Sites')}
          <img src={smileSrc} className="inline px-4" />
        </h1>
        <div className="text-center mb-5 justify-center flex"></div>
        <p className="mb-5">{/* <Pay /> */}</p>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              {translate('My queue (last 30 days)')}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <p className="mb-5 px-6">123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
