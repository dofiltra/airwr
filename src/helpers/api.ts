/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dotranslate, RewriteText, headers } from 'dprx-types'
import fetch from 'unfetch'

const { VITE_HOST_API_DEV, VITE_HOST_API_PROD } = import.meta.env

export const HOST_API = window.location.origin.includes('localhost')
  ? VITE_HOST_API_DEV
  : VITE_HOST_API_PROD

export async function send({
  method = 'GET',
  body,
  url,
}: {
  url: string
  method: 'GET' | 'POST'
  body?: any
}) {
  try {
    const resp = await fetch(url, {
      headers,
      method,
      body: body ? JSON.stringify(body) : undefined,
    })

    return await resp.json()
  } catch (error: any) {
    return { error }
  }
}

export async function addTranslateData(data: Dotranslate) {
  return await send({
    url: `${HOST_API}/api/translate/add`,
    method: 'POST',
    body: data,
  })
}

export async function addRewriteData(data: RewriteText) {
  return await send({
    url: `${HOST_API}/api/rewriteText/add`,
    method: 'POST',
    body: data,
  })
}

export async function geRewriteData(id: string) {
  const { item } = await send({
    url: `${HOST_API}/api/rewriteText/get?id=${id}`,
    method: 'GET',
  })

  return item
}

export async function getRewriteQueue() {
  const { count = 0 } = await send({
    url: `${HOST_API}/api/rewriteText/getQueue`,
    method: 'GET',
  })

  return count
}

export async function getTranslateQueue() {
  const { count = 0 } = await send({
    url: `${HOST_API}/api/translate/getQueue`,
    method: 'GET',
  })
  return count
}

export async function getCoins(token?: string, isFull = '') {
  if (!token) {
    return { coins: 0 }
  }

  const { coins = 0, info = {} } = await send({
    url: `${HOST_API}/api/balance/get?token=${token}&isFull=${isFull}`,
    method: 'GET',
  })

  return { coins, info }
}

export async function getRewritedCharsCount(token?: string) {
  if (!token) {
    return 0
  }

  const { history = {} } = await send({
    url: `${HOST_API}/api/stats/getRewritedCharsCount?token=${token}`,
    method: 'GET',
  })

  return history
}

export async function detectLang(text: string) {
  return await send({
    url: 'https://api.dofiltra.com/api/lang/detect',
    body: { text },
    method: 'POST',
  })
}

export async function addExtractorGroups(opts: {
  token: string
  urls: string[]
  keywords: string[]
}) {
  return await send({
    url: `${HOST_API}/api/extractor/add`,
    body: opts,
    method: 'POST',
  })
}
