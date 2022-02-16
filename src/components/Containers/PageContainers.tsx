/* eslint-disable @typescript-eslint/no-explicit-any */
import { smiles } from 'helpers/smiles'
import { useLocalize } from '@borodutch-labs/localize-react'

export const PageH1 = ({ title }: { title: string }) => {
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  return (
    <div className="text-center">
      <h1 className="mt-4 text-5xl font-bold">
        {title}
        <img src={smileSrc} className="inline px-4" />
      </h1>
    </div>
  )
}

export const QueueContainer = ({ count = '...' }: any) => {
  const { translate } = useLocalize()

  return (
    <>
      <div className="mb-1 w-full text-center">
        <div>{translate('Queue', { count })}</div>
      </div>
    </>
  )
}
