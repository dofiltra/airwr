/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doextractor, Dotranslate, RewriteText, headers } from 'dprx-types'
import fetch from 'unfetch'

const { VITE_HOST_API_DEV, VITE_HOST_API_PROD } = import.meta.env

export const HOST_API = window.location.origin.includes('localhost')
  ? VITE_HOST_API_DEV
  : VITE_HOST_API_PROD

export class BaseApi {
  static async send({
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
}

export class BalanceApi extends BaseApi {
  static async getCoins(token?: string, isFull = '') {
    if (!token) {
      return { coins: 0 }
    }

    const { coins = 0, info = {} } = await this.send({
      url: `${HOST_API}/api/balance/get?token=${token}&isFull=${isFull}`,
      method: 'GET',
    })

    return { coins, info }
  }

  static async isExistsPromo(code: string) {
    if (!code) {
      return { isExists: false }
    }

    const { exists = false } = await this.send({
      url: `${HOST_API}/api/balance/promo?code=${code}`,
      method: 'GET',
    })

    return { isExists: exists }
  }

  static async setPromoCode(token: string, code: string) {
    if (!code || !token) {
      return { set: null }
    }

    const { set } = await this.send({
      url: `${HOST_API}/api/balance/promo?token=${token}&code=${code}&action=set`,
      method: 'GET',
    })

    return { set }
  }

  static async getPromoCode(token: string) {
    if (!token) {
      return { code: '', percent: 10 }
    }

    const { get } = await this.send({
      url: `${HOST_API}/api/balance/promo?token=${token}&action=get`,
      method: 'GET',
    })

    return { code: get?.code, percent: get?.percent || 10 }
  }
}

export class TranslateApi extends BaseApi {
  static async add(data: Dotranslate) {
    return await this.send({
      url: `${HOST_API}/api/translate/add`,
      method: 'POST',
      body: data,
    })
  }

  static async getQueue() {
    const { count = 0 } = await this.send({
      url: `${HOST_API}/api/translate/getQueue`,
      method: 'GET',
    })
    return count
  }
}

export class RewriteApi extends BaseApi {
  static async add(data: RewriteText) {
    return await this.send({
      url: `${HOST_API}/api/rewriteText/add`,
      method: 'POST',
      body: data,
    })
  }

  static async get(id: string) {
    const { item } = await this.send({
      url: `${HOST_API}/api/rewriteText/get?id=${id}`,
      method: 'GET',
    })

    return item
  }

  static async getQueue() {
    const { count = 0 } = await this.send({
      url: `${HOST_API}/api/rewriteText/getQueue`,
      method: 'GET',
    })

    return count
  }

  static async getRewritedCharsCount(token?: string) {
    if (!token) {
      return 0
    }

    const { history = {} } = await this.send({
      url: `${HOST_API}/api/stats/getRewritedCharsCount?token=${token}`,
      method: 'GET',
    })

    return history
  }
}

export class LangApi extends BaseApi {
  static async detect(text: string) {
    return await this.send({
      url: 'https://api.dofiltra.com/api/lang/detect',
      body: { text },
      method: 'POST',
    })
  }
}

export class ExtractorApi extends BaseApi {
  static async add(body: Doextractor[]) {
    return await this.send({
      url: `${HOST_API}/api/extractor/add`,
      body,
      method: 'POST',
    })
  }
}
