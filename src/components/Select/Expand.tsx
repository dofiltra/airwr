/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLocalize } from '@borodutch-labs/localize-react'

export const ExpandMode = [
  { value: 'LONGER', title: 'Expand' },
  { value: 'SHORTER', title: 'Shorten' },
]

export const ExpandBox = (props: any) => {
  const { translate } = useLocalize()

  return (
    <select name="expand" {...props}>
      {ExpandMode.map((lang) => (
        <option value={lang.value}>
          {translate(lang.title || lang.value)}
        </option>
      ))}
    </select>
  )
}
