import { FC } from 'react'
import { classnames, container, padding, width } from 'classnames/tailwind'

const root = classnames(
  container('container'),
  padding('py-4'),
  width('w-full')
)
const Root: FC = ({ children }) => {
  return <div className={root}>{children}</div>
}

export default Root
