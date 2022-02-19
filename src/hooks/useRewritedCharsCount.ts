/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RewriteApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useRewritedCharsCount(token?: string) {
  const [history, setHistory] = useState<
    { [dateKey: string]: number } | undefined
  >(undefined)
  const [queue, setQueue] = useState<any>({})

  const fetchData = async () => {
    const { history: h, queue: q } = await RewriteApi.getRewritedCharsCount(
      token
    )
    setHistory(h)
    setQueue(q)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { history, queue }
}
