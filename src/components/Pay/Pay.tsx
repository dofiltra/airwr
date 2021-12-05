/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import React, { useContext, useState } from 'preact/compat'
import useBalance from 'hooks/useBalance'

export default function Pay({}) {
  const { user } = useContext(AuthContext)
  const { translate } = useLocalize()
  const { coins = 0 } = useBalance(user?.uid || '')
  const [plusCoins, setPlusCoins] = useState(10)
  const [payLink, setPayLink] = useState('')

  return (
    <>
      <div className="p-3  text-neutral-content rounded-box mb-2">
        <p className="md:block p-2">
          {translate('Balance', { coins })}
          <span className="text-purple-400"> + ${plusCoins || 1}</span>
        </p>
        <div className="md:block p-2">
          <div className="form-control max-w-screen-sm">
            <div className="relative">
              <input
                type="number"
                placeholder="10"
                value={plusCoins || 1}
                onChange={(e: any) => {
                  setPayLink('')
                  setPlusCoins(parseInt(e.target.value || '1', 10))
                }}
                className="w-full pr-16 input input-primary input-bordered"
              />
              <button
                className="absolute top-0 right-0 rounded-l-none btn btn-primary"
                onClick={(e) =>
                  user?.uid && setPayLink(payYoomoney(user.uid, plusCoins))
                }
              >
                {translate('BalanceUpButton')}
              </button>
            </div>
            <div className="btn-group py-2">
              <button className="btn btn-error text-error btn-xs btn-active btn-disabled">
                Yoomoney
              </button>
            </div>
            {payLink && (
              <p>
                <a href={payLink} className="text-purple-600">
                  {translate('PayLink', { payLink })}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function payYoomoney(token: string, plusCoins: number) {
  if (plusCoins < 1) {
    alert('Minimum 1 USD')
    return ''
  }

  const USDRUB = 73 // TODO: from api
  const payLink = `https://api.dofiltra.com/api/balance/pay-yoomoney?sum=${
    plusCoins * USDRUB
  }&label=${token}&targets=AI+Dofiltra`
  window.open(payLink, '_blank')

  return payLink
}
