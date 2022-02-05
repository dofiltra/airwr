import { useLocalize } from '@borodutch-labs/localize-react'

export const Loading = () => {
  return (
    <div className="text-center justify-center flex">
      <img src="https://i.smiles2k.net/computer_smiles/downloading.gif" />
    </div>
  )
}

export const LoadingContainer = () => {
  const { translate } = useLocalize()

  return (
    <div className="h-96">
      <div className="justify-center flex">{translate('Loading')}</div>
      <Loading />
    </div>
  )
}
