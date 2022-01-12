/* eslint-disable @typescript-eslint/no-explicit-any */

import { LangCode } from 'dprx-types'
import { useLocalize } from '@borodutch-labs/localize-react'

export const LangCodes = Object.keys(LangCode).map((name) => ({
  code: (LangCode as any)[name],
  name,
}))

export const LangBox = (props: any) => {
  const { translate } = useLocalize()

  return (
    <select {...props}>
      {LangCodes.map((lang) => (
        <option value={lang.code}>{translate(lang.name || lang.code)}</option>
      ))}
    </select>
  )
}
