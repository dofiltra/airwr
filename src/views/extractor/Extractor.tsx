/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Doextractor, TaskStatus } from 'dprx-types'
import { ExtractorApi } from 'helpers/api'
import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { smiles } from 'helpers/smiles'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'

export default () => {
  const { translate } = useLocalize()
  const [linkResultId, setLinkResult] = useState('')
  const [groups, setGroups] = useState([] as string[][])
  const [isVisibleContent, setVisibleContent] = useState(true)
  const { user } = useContext(AuthContext)
  const token = user?.uid || ''
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
                  const groups = e.target.value
                    .split('\n\n')
                    .map((x) => x.split('\n'))

                  setGroups(groups)
                }}
              ></textarea>
            </div>
          </div>

          <div className="flex-auto space-x-3 my-6 flex items-center">
            <button
              onClick={() => {
                const add = async () => {
                  if (!groups?.length) {
                    return alert(
                      translate('Required groups (urls or keywords)')
                    )
                  }

                  setVisibleContent(false)

                  const { result, error } = await ExtractorApi.add(
                    groups.map(
                      (urlsOrKeys) =>
                        ({
                          token,
                          status: TaskStatus.NotStarted,
                          urlsOrKeys,
                        } as Doextractor)
                    )
                  )

                  if (!result && !error) {
                    setVisibleContent(true)
                    return alert(translate('TryAgainLater'))
                  }

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
