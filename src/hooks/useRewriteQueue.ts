/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RewriteApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useRewriteQueue() {
  const [queueCount, setQueueCount] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    const count = await RewriteApi.getQueue()
    setQueueCount(count)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { queueCount, queueChars: (queueCount || 0) * 7503 }
}
