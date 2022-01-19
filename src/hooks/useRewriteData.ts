/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RewriteApi } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useRewriteText(id: string) {
  const [rewriteData, setRewriteData] = useState<
    undefined | { blocks: any[]; status: number; targetLang: number }
  >(undefined)

  const fetchData = async () => {
    const data = await RewriteApi.get(id)
    setRewriteData(data)
    // const status = data?.status || 0

    // if (status !== 9) {
    //   setTimeout(() => {
    //     void fetchData()
    //   }, 15e3)
    // }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { rewriteData }
}
