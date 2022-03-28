/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BalanceApi } from '@dofiltra/tailwind'
import { FC } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { headers } from 'dprx-types'
import { useState } from 'preact/hooks'

export const OdmBalancePage: FC = () => {
  const [error, setError] = useState('')
  const [userBalance, setUserBalance] = useState('')
  const [promoBalance, setPromoBalance] = useState('')
  const [tokenPromo, setTokenPromo] = useState('')
  const [coins, setCoins] = useState(0)
  const [cost, setCost] = useState(0.01)

  return (
    <>
      <div className=" w-full card p-5">
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            <label>Token</label>
            <input
              placeholder="token"
              className="w-full min-h-8 p-2"
              value={tokenPromo}
              onChange={(e) => {
                const [token, promo] = e.target.value.split('__')
                setTokenPromo(e.target.value)

                void BalanceApi.getCoins(token, 'true').then(({ info }) => {
                  info?.cost && setCost(info.cost)
                  setUserBalance(JSON.stringify(info, null, 4))
                })
              }}
            />

            <p className="pt-4">Coins</p>
            <input
              placeholder="coins"
              className="w-full min-h-8 p-2"
              type="number"
              value={coins}
              onChange={(e) => {
                setCoins(parseInt(e.target.value, 10))
              }}
            />

            <p className="pt-5">Cost per 1000 chars</p>

            <input
              placeholder="cost"
              className="w-full min-h-8 p-2"
              type="number"
              value={cost}
              onChange={(e) => {
                const val = e.target.value && parseFloat(e.target.value)
                val && setCost(val)
              }}
            />
            <hr />
            <br />
            <div>User balance</div>
            <pre className="text-gray-600">{userBalance}</pre>
            <br />
            {promoBalance && (
              <>
                <div>Promo balance</div>
                <pre className="text-gray-600">{promoBalance}</pre>
                <br />
              </>
            )}

            {error && (
              <>
                <div>Error</div>
                <pre className="text-gray-600">{error}</pre>
              </>
            )}
          </div>
        </div>

        <div className="flex-auto space-x-3 my-6 flex items-center">
          <button
            onClick={() =>
              addCoins({
                tokenPromo,
                coins,
                cost,
              }).then(
                ({
                  userBalance = {},
                  promoBalance = {},
                  error = { details: 'No error :)' },
                }) => {
                  setUserBalance(JSON.stringify(userBalance, null, 4))
                  setPromoBalance(JSON.stringify(promoBalance, null, 4))
                  setError(JSON.stringify(error, null, 4))
                }
              )
            }
            className="w-full btn btn-success"
          >
            Add
          </button>
        </div>
      </div>
    </>
  )
}

type TQueueOpts = {
  coins: number
  cost: number
  tokenPromo: string
}
async function addCoins({ tokenPromo, coins, cost }: TQueueOpts) {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const { secret = '' } = Object.fromEntries(urlSearchParams.entries())

  const resp = await fetch(`${HOST_API}/api/balance/odm-add`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      tokenPromo,
      coins,
      cost,
      secret,
    }),
    mode: 'cors',
  })

  if (!resp.ok) {
    alert('TryAgainLater')
    return { error: 'error' }
  }

  return await resp.json()
}
