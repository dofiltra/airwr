/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useQueueCount() {
  const [queueCount, setQueueCount] = useState<number>(0)

  const fetchData = async () => {
    const { count } = await BaseApi.getQueue()
    setQueueCount(count)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { queueCount, queueChars: (queueCount || 0) * 7503 }
}
