import { smiles } from 'helpers/smiles'
import { useLocalize } from '@borodutch-labs/localize-react'
import useQueueCount from 'hooks/useQueueCount'

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

export const QueueContainer = () => {
  const { translate } = useLocalize()
  const { queueCount = 0, queueChars = 0 } = useQueueCount()

  return (
    <>
      <div className="mb-1 w-full text-center">
        <div>
          {translate('Queue', { count: queueCount })}
          {/* {queueCount > 100 &&
              translate('QueueCharsCount', { chars: queueChars })} */}
        </div>
      </div>
    </>
  )
}
