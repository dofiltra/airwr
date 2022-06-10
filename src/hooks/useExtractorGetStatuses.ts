/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExtractorApi } from 'helpers/api'
import { TaskStatus } from 'dprx-types'
import { useEffect, useState } from 'react'

export default function useExtractorGetStatuses(token: string, ids: string[]) {
  const [statuses, setStatuses] = useState<
    { _id: string; status: TaskStatus }[]
  >([])

  const fetchData = async () => {
    const { result: data } = await ExtractorApi.getStatuses(token, ids)
    setStatuses(data)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return statuses
}
