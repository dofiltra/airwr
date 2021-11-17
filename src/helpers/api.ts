import fetch from 'unfetch'

export const HOST_API = 'https://api.dofiltra.com'
export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export async function getUserCount() {
  const data = await (await fetch(`${HOST_API}/`)).json()
  return data.count
}
