/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { geRewriteData } from 'helpers/api'
import { useEffect, useState } from 'react'

export default function useRewriteText(id: string) {
  const [rewriteData, setRewriteData] = useState<
    undefined | { blocks: any[]; status: number; targetLang: number }
  >(undefined)

  const fetchData = async () => {
    setRewriteData(await geRewriteData(id))
  }

  useEffect(() => {
    void fetchData()
  }, [])

  return { rewriteData }
}
