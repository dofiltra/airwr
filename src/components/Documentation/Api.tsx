import { FC } from 'react'
import { classnames } from 'classnames/tailwind'

const bodyText = classnames('text-center')
export const DocumentationApi: FC = ({ children }) => {
  return <p className={bodyText}>{children}</p>
}
