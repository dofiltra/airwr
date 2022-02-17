import { FC } from 'react'
import { classnames, container, padding, width } from 'classnames/tailwind'
import EmailAuth from './EmailAuth'

const root = classnames(
  container('lg:container'),
  padding('py-4'),
  width('w-full')
)
const Root: FC = ({ children }) => {
  return (
    <div className={root}>
      {children}
      <EmailAuth />
    </div>
  )
}

export default Root
