/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiSite } from 'dprx-types'
import { AiSiteApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useAiSites(token: string) {
  const [aiSites, setAiSites] = useState<AiSite[]>([])

  const fetchData = async () => {
    const { result: data } = await AiSiteApi.get({ token })
    setAiSites(data)
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { aiSites }
}
