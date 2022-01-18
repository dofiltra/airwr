/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { addExtractorGroups } from 'helpers/api'
import { smiles } from 'helpers/smiles'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useState } from 'preact/hooks'

export default () => {
  const { translate } = useLocalize()
  const [linkResultId, setLinkResult] = useState('')
  const [groups, setGroups] = useState([[]] as string[][])
  const [isVisibleContent, setVisibleContent] = useState(true)
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  if (linkResultId) {
    return <Navigate to={`/extractor/result/${linkResultId}`} />
  }

  if (!isVisibleContent) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="text-center">
            <h1 className="mt-4 text-5xl font-bold">
              {translate('ExtractorTitle')}
              <img src={smileSrc} className="inline px-4" />
            </h1>
          </div>

          <div className="w-full card p-4">
            <div className="mb-1 md:mb-0 w-full p-2 ">
              <label className="">{translate('EnterTextForExtractor')}</label>
              <textarea
                className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3"
                rows={10}
                placeholder={`${translate('EnterTextForExtractorPlaceholder')}`}
                onChange={(e) => {
                  setGroups([
                    e.target.value.split('\n').filter((x) => x?.trim()),
                  ])
                }}
              ></textarea>
            </div>
          </div>

          <div className="flex-auto space-x-3 my-6 flex items-center">
            <button
              // disabled={!editorData?.blocks?.length}
              onClick={() => {
                const add = async () => {
                  if (!groups?.length) {
                    return alert(translate('Required urls'))
                  }

                  setVisibleContent(false)

                  const resp = await addExtractorGroups({
                    groups,
                  })

                  if (!resp.ok) {
                    setVisibleContent(true)
                    return alert(translate('TryAgainLater'))
                  }

                  const { result, error } = await resp.json()

                  if (result?._id) {
                    setLinkResult(result._id)
                  }
                  if (error || result?.errors) {
                    alert(JSON.stringify(error || result?.errors || {}))
                  }
                }

                add()
              }}
              className="w-full btn btn-success"
            >
              {translate('ButtonSend')}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
