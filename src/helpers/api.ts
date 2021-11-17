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

    const { item } = await resp.json()
    return item
  } catch {
    //
  }
}
