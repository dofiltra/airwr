/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiSite, Doextractor, Dotranslate, RewriteText } from 'dprx-types'
import { BaseApi, HostManager } from '@dofiltra/tailwind'

export const HOST_API = HostManager.getHostApi()

export class TranslateApi extends BaseApi {
  static async add(data: Dotranslate) {
    return await this.send({
      url: `${HOST_API}/api/translate/add`,
      method: 'POST',
      body: data,
    })
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

  static async getRewritedCharsCount(token?: string) {
    if (!token) {
      return { history: {}, queue: {} }
    }

    const { history = {}, queue = {} } = await this.send({
      url: `${HOST_API}/api/stats/getRewritedCharsCount?token=${token}`,
      method: 'GET',
    })

    return { history, queue }
  }
}

export class LangApi extends BaseApi {
  static async detect(text: string) {
    return await this.send({
      url: `${HOST_API}/api/lang/detect`,
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

  static async html2blocks(html: string) {
    if (!html?.length) {
      return { blocks: [] }
    }

    return await this.send({
      url: `${HOST_API}/api/extractor/html2blocks`,
      body: { html },
      method: 'POST',
    })
  }
}

export class AiSiteApi extends BaseApi {
  static async add(body: AiSite[]) {
    return await this.send({
      url: `${HOST_API}/api/aisite/add`,
      body,
      method: 'POST',
    })
  }

  static async get(body: { token: string }) {
    return await this.send({
      url: `${HOST_API}/api/aisite/get`,
      body,
      method: 'POST',
    })
  }

  static async remove(body: { host: string; token: string; _id: string }) {
    return await this.send({
      url: `${HOST_API}/api/aisite/remove`,
      body,
      method: 'POST',
    })
  }
}
