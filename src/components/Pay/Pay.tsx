/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { SignInButtons } from 'components/Buttons/SignIn'
import { SignOutButton } from 'components/Buttons/SignOut'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import DefaultButton from 'components/Buttons/Button'
import Language from 'models/Language'
import React, { useContext, useState } from 'preact/compat'
import useBalance from 'hooks/useBalance'

export default function Pay({}) {
  const { user } = useContext(AuthContext)
  const { translate } = useLocalize()
  const { coins = 0 } = useBalance(user?.uid || '')
  const [plusCoins, setPlusCoins] = useState(10.5)

  return (
    <>
      <div className="p-3  text-neutral-content rounded-box mb-2">
        <p className="md:block p-2">
          {translate('Balance', { coins })}
          <span className="text-purple-400"> + ${plusCoins}</span>
        </p>
        <div className="md:block p-2">
          <div className="form-control max-w-screen-sm">
            {/* <label className="label">
              <span className="label-text">{translate('BalanceUp')}</span>
            </label> */}
            <div className="relative">
              <input
                type="number"
                placeholder="10"
                value={plusCoins}
                onChange={(e: any) => {
                  setPlusCoins(parseFloat(e.target.value))
                }}
                className="w-full pr-16 input input-primary input-bordered"
              />
              <button
                className="absolute top-0 right-0 rounded-l-none btn btn-primary"
                onClick={(e) => user?.uid && payYoomoney(user.uid, plusCoins)}
              >
                {translate('BalanceUpButton')}
              </button>
            </div>
            <div className="btn-group py-2">
              <button className="btn btn-error text-error btn-xs btn-active btn-disabled">
                Yoomoney
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function payYoomoney(token: string, plusCoins: number) {
  const payLink = `https://api.dofiltra.com/api/balance/pay-yoomoney?sum=${
    plusCoins * 73
  }&label=${token}&targets=AI+Dofiltra`
  console.log(payLink)
  window.open(payLink, '_blank')

  return payLink
}
