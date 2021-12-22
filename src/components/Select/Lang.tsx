/* eslint-disable @typescript-eslint/no-explicit-any */

export const LangCodes = [
  { code: 'EN', name: 'English' },
  { code: 'RU', name: 'Russian' },
  { code: 'FR', name: 'French' },
  { code: 'ES', name: 'Spanish' },
  { code: 'DE', name: 'German' },
]

export const LangBox = (props: any) => {
  return (
    <select name="targetLang" {...props}>
      {LangCodes.map((lang) => (
        <option value={lang.code}>{lang.name || lang.code}</option>
      ))}
    </select>
  )
}
