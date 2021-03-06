/* eslint-disable @typescript-eslint/no-explicit-any */

import { RewriteMode } from 'dprx-types'
import { useLocalize } from '@borodutch-labs/localize-react'

export const ExpandMode = [
  { value: RewriteMode.Shorter, title: 'Shorter' },
  { value: RewriteMode.Longer, title: 'Longer' },
]

export const ExpandBox = (props: any) => {
  const { translate } = useLocalize()

  return (
    <select name="expand" {...props}>
      {ExpandMode.map((mode) => (
        <option value={mode.value}>
          {translate(mode.title || mode.value)}
        </option>
      ))}
    </select>
  )
}
