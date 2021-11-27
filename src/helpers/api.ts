import fetch from 'unfetch'

export const HOST_API = 'https://api.dofiltra.com'
export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export async function geRewriteData(id: string) {
  try {
    const resp = await fetch(`${HOST_API}/api/rewriteText/get?id=${id}`, {
      headers,
      method: 'GET',
    })

    const { item, error } = await resp.json()
    return item
  } catch {
    //
  }
}

export async function getRewriteQueue() {
  try {
    const resp = await fetch(`${HOST_API}/api/rewriteText/getQueue`, {
      headers,
      method: 'GET',
    })

    const { count } = await resp.json()
    return count
  } catch {
    //
  }
}
