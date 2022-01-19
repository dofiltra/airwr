/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RewriteApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useRewritedCharsCount(token?: string) {
  const [history, setHistory] = useState<
    { [dateKey: string]: number } | undefined
  >(undefined)

  const fetchData = async () => {
    const result = await RewriteApi.getRewritedCharsCount(token)
    setHistory(result)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { history }
}
