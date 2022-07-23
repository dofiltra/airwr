/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BalanceApi, HostManager } from '@dofiltra/tailwind'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import React, { useContext, useEffect, useState } from 'preact/compat'
import useBalance from 'hooks/useBalance'

export default function Pay({}) {
  const [plusCoins, setPlusCoins] = useState(10)
  const [promoCode, setPromoCode] = useState('')
  const [isExistsPromo, setExistsPromo] = useState(false)
  const [payLink, setPayLink] = useState('')
  const [payType, setPayType] = useState<
    'Yoomoney' | 'WMZ' | 'CARDS' | 'QIWI' | 'USDT'
  >('Yoomoney')

  const [usdtrub, setUsdtRub] = useState(0)
  const [usdtwmz, setUsdtWmz] = useState(1.11)

  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  const { coins = 0 } = useBalance(user?.uid || '')
  const { translate } = useLocalize()

  useEffect(() => {
    const loadPromo = async () => {
      const { RUB: usdtRub } = await BalanceApi.getUsdtRate({ currency: 'RUB' })
      const { RUB: wmzRub } = await BalanceApi.getWmzRate({ currency: 'RUB' })
      const wmzRubBuy = wmzRub?.buy

      setUsdtRub(usdtRub)

      if (wmzRubBuy) {
        setUsdtWmz(parseFloat((usdtRub / wmzRubBuy).toFixed(2)))
      }
    }
    void loadPromo()
  }, [])

  return (
    <>
      <div className="p-3  text-neutral-content rounded-box mb-2">
        <p className="md:block p-2">
          {translate('Balance', { coins: coins.toFixed(3) })}
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
                  payType === 'QIWI' ? 'btn-active btn-error text-error' : ''
                }`}
                onClick={() => setPayType('QIWI')}
              >
                QIWI
              </button>
              <button
                className={`btn btn-xs ${
                  payType === 'USDT' ? 'btn-active btn-error text-error' : ''
                }`}
                onClick={() => setPayType('USDT')}
              >
                USDT
              </button>
              <button
                className={`btn btn-xs ${
                  payType === 'WMZ' ? 'btn-active btn-error text-error' : ''
                }`}
                onClick={() => {
                  setPayType('WMZ')

                  token && setPayLink(payWmz(token, plusCoins, promoCode))
                }}
              >
                WMZ
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
                void BalanceApi.isExistsPromo(code).then(
                  ({ isExists }: { isExists: boolean }) => {
                    setExistsPromo(!!isExists)
                  }
                )
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
                    setPayLink(
                      payYoomoney(token, plusCoins, usdtrub, promoCode)
                    )
                  }
                >
                  {translate('BalanceUpButton')}
                </button>
              </div>
            )}
            {payType === 'QIWI' && (
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
                  onClick={async (e) =>
                    token &&
                    setPayLink(
                      await payQiwi(token, plusCoins, usdtrub, promoCode)
                    )
                  }
                >
                  {translate('BalanceUpButton')}
                </button>
              </div>
            )}
            {payType === 'WMZ' && (
              <div>
                {translate('WMZ', {
                  token: promoCode ? `${token}__${promoCode}` : user?.uid || '',
                })}
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
            {payType === 'USDT' && (
              <pre>
                {translate('USDT', {
                  token,
                  promoCode: promoCode ? `__${promoCode}` : '',
                })}
              </pre>
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
        <div className="md:block p-2">
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr className="font-bold">
                  <th>{translate('Payment method')}</th>
                  <th>{translate('Rate')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>USDT</td>
                  <td>
                    Отдам:&nbsp;&nbsp; 1 USDT <br />
                    Получу: 1 ₮
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>WMZ</td>
                  <td>
                    Отдам:&nbsp;&nbsp; {usdtwmz} <small>WMZ</small> <br />
                    Получу: 1 ₮
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    TINKOFF
                    <br />
                    SBER
                    <br />
                    ALFABANK
                    <br />
                    ROSBANK
                    <br />
                    SBP (by phone number)
                  </td>
                  <td>
                    Отдам:&nbsp;&nbsp; {usdtrub} RUB <br />
                    Получу: 1 ₮
                  </td>
                  <td>
                    <a
                      href="https://www.sberbank.ru/ru/quotes/currencies?currency=USD"
                      target={'_blank'}
                    >
                      https://www.sberbank.ru/ru/quotes/currencies?currency=USD
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>QIWI</td>
                  <td>
                    Отдам:&nbsp;&nbsp;{usdtrub} RUB <br />
                    Получу: 1 ₮
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>YOOMONEY</td>
                  <td>
                    Отдам:&nbsp;&nbsp;{usdtrub} RUB <br />
                    Получу: 1 ₮
                  </td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
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
  const payLink = `${HostManager.getHostApi()}/api/balance/pay-yoomoney?sum=${
    plusCoins * usdrub
  }&label=${label}&targets=AI+Dofiltra&successUrl=https://ai.dofiltra.com/profile`
  window.open(payLink, '_blank')

  return payLink
}

async function payQiwi(
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
  const sum = plusCoins * usdrub
  const url = `${HostManager.getHostApi()}/api/balance/pay-qiwi?sum=${sum}&comment=AI%20Dofiltra&token=${label}`
  const resp = await fetch(url)
  const { payUrl = '' } = await resp.json()

  window.open(payUrl, '_blank')

  return payUrl
}

function payWmz(token: string, plusCoins: number, promoCode?: string) {
  if (plusCoins < 1) {
    alert('Minimum 1 USD')
    return ''
  }

  const wmid = 302561646230
  const label = `${token}--${promoCode}`
  const payUrl = `https://pay.web.money/${wmid}?currency=WMZ&amount=${plusCoins}&description=${label}`

  window.open(payUrl, '_blank')

  return payUrl
}
