import { FC } from 'react'
import { classnames } from 'classnames/tailwind'

const root = classnames('container', 'py-4', 'w-full')
const Root: FC = ({ children }) => {
  return <div className={root}>{children}</div>
}

export default Root
