/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import {
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  fontWeight,
  margin,
  outlineStyle,
  padding,
  textColor,
} from 'classnames/tailwind'

type ButtonProps = {
  onClick: () => void
  title: any
}

const button = classnames(
  backgroundColor('bg-transparent', 'hover:bg-blue-500'),
  textColor('text-blue-700', 'hover:text-white'),
  fontWeight('font-semibold'),
  padding('py-2', 'px-4'),
  margin('mx-1'),
  borderWidth('border'),
  borderColor('border-blue-500', 'hover:border-transparent'),
  borderRadius('rounded'),
  outlineStyle('focus:outline-none')
)
const DefaultButton: FC<ButtonProps> = ({ onClick, title }) => {
  return (
    <button className={button} onClick={onClick}>
      {title}
    </button>
  )
}

export default DefaultButton
