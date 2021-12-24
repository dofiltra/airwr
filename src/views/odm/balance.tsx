/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'preact/compat'
import { HOST_API, getCoins, headers } from 'helpers/api'
import { useState } from 'preact/hooks'

export const OdmBalancePage: FC = () => {
  const [info, setInfo] = useState('')
  const [token, setToken] = useState('')
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
              value={token}
              onChange={(e) => {
                setToken(e.target.value)
                void getCoins(e.target.value, 'true').then(({ info }) =>
                  setInfo(JSON.stringify(info, null, 4))
                )
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
            <pre className="text-gray-600">{info}</pre>
          </div>
        </div>

        <div className="flex-auto space-x-3 my-6 flex items-center">
          <button
            onClick={() =>
              addCoins({
                token,
                coins,
                cost,
              }).then((info) => setInfo(JSON.stringify(info, null, 4)))
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
  token: string
}
async function addCoins({ token, coins, cost }: TQueueOpts) {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const { secret = '' } = Object.fromEntries(urlSearchParams.entries())

  const resp = await fetch(`${HOST_API}/api/balance/odm-add`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      coins,
      cost,
      token,
      secret,
    }),
    mode: 'cors',
  })

  if (!resp.ok) {
    alert('TryAgainLater')
    return { error: 'error' }
  }

  const { info, error } = await resp.json()

  return info || error
}
