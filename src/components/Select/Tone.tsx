/* eslint-disable @typescript-eslint/no-explicit-any */

import { RewriteMode } from 'dprx-types'
import { useLocalize } from '@borodutch-labs/localize-react'

export const ToneMode = [
  { value: RewriteMode.Formal, title: 'Formal' },
  { value: RewriteMode.Casual, title: 'Casual' },
]

export const ToneBox = (props: any) => {
  const { translate } = useLocalize()

  return (
    <select name="tone" {...props}>
      {ToneMode.map((lang) => (
        <option value={lang.value}>
          {translate(lang.title || lang.value)}
        </option>
      ))}
    </select>
  )
}
