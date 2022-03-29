/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BalanceApi, useBalance } from '@dofiltra/tailwind'
import { HOST_API } from 'helpers/api'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import React, { useContext, useEffect, useState } from 'preact/compat'

export default function Pay({}) {
  const [plusCoins, setPlusCoins] = useState(10)
  const [promoCode, setPromoCode] = useState('')
  const [isExistsPromo, setExistsPromo] = useState(false)
  const [payLink, setPayLink] = useState('')
  const [payType, setPayType] = useState<'Yoomoney' | 'CARDS'>('Yoomoney')
  const [usdrub, setUsdRub] = useState(100)

  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  const { translate } = useLocalize()
  const { coins = 0 } = useBalance(user?.uid || '')

  useEffect(() => {
    const loadPromo = async () => {
      const { USDRUB } = await BalanceApi.getUsdPrice()
      setUsdRub(USDRUB)
    }
    void loadPromo()
  }, [])

  return (
    <>
      <div className="p-3  text-neutral-content rounded-box mb-2">
        <p className="md:block p-2">
          {translate('Balance', { coins: coins.toFixed(4) })}
        </p>
        <div className="md:block p-2">
          <div className="form-control">
            <div className="btn-group py-2">
              <button
                className={`btn btn-xs ${
                  payType === 'Yoomoney'
                    ? 'btn-active btn-error text-error'
                    : ''
                }`}
                onClick={() => setPayType('Yoomoney')}
              >
                Yoomoney
              </button>
              <button
                className={`btn btn-xs ${
                  payType === 'CARDS' ? 'btn-active btn-error text-error' : ''
                }`}
                onClick={() => setPayType('CARDS')}
              >
                Cards
              </button>
            </div>

            <input
              type="text"
              placeholder="PROMO CODE"
              value={promoCode}
              onChange={(e: any) => {
                const code = e.target.value?.toUpperCase()
                setPromoCode(code)
                void BalanceApi.isExistsPromo(code).then(({ isExists }) => {
                  setExistsPromo(!!isExists)
                })
              }}
              className={`w-full pr-16 mb-2 input input-primary input-bordered ${
                promoCode
                  ? isExistsPromo
                    ? 'input-success'
                    : 'input-error'
                  : ''
              }`}
            />

            {payType === 'Yoomoney' && (
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
                    token &&
                    setPayLink(payYoomoney(token, plusCoins, usdrub, promoCode))
                  }
                >
                  {translate('BalanceUpButton')}
                </button>
              </div>
            )}
            {payType === 'CARDS' && (
              <div>
                {translate('CARDS', {
                  token,
                  promoCode: promoCode ? `__${promoCode}` : '',
                })}
              </div>
            )}

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

function payYoomoney(
  token: string,
  plusCoins: number,
  usdrub: number,
  promoCode?: string
) {
  if (plusCoins < 1) {
    alert('Minimum 1 USD')
    return ''
  }

  const label = `${token}__${promoCode}`
  const payLink = `${HOST_API}/api/balance/pay-yoomoney?sum=${
    plusCoins * usdrub
  }&label=${label}&targets=AI+Dofiltra&successUrl=https://ai.dofiltra.com/profile`
  window.open(payLink, '_blank')

  return payLink
}
