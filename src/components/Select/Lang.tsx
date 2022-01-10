/* eslint-disable @typescript-eslint/no-explicit-any */

import { LangCode } from 'dprx-types'

export const LangCodes = Object.keys(LangCode).map((name) => ({
  code: (LangCode as any)[name],
  name,
}))

export const LangBox = (props: any) => {
  return (
    <select name="targetLang" {...props}>
      {LangCodes.map((lang) => (
        <option value={lang.code}>{lang.name || lang.code}</option>
      ))}
    </select>
  )
}
