/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCoins } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useBalance(token?: string) {
  const [coins, setCoins] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    const coinsResult = await getCoins(token)
    setCoins(coinsResult)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { coins }
}
