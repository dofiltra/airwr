/* eslint-disable @typescript-eslint/no-explicit-any */
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { FC, useState } from 'preact/compat'
import { Loading } from 'components/Base/Loader'
import { getRewriterStatusText } from 'helpers/rewriter'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'
import useRewriteText from 'hooks/useRewriteData'

type TRewriterResultPage = {
  //
}

function getBackgroundColorByStatus(status: number) {
  switch (status) {
    case 3: // inProgrss
      return 'alert-info'
    case 9: // completed
      return 'alert-success'
  }

  return ''
}

const RewriterResultPage: FC<TRewriterResultPage> = () => {
  const { id = '' } = useParams()
  const { rewriteData } = useRewriteText(id)
  const { translate } = useLocalize()
  // console.log('rewriteData', rewriteData)

  if (!rewriteData?.blocks?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('loading')}</div>
        <Loading />
      </div>
    )
  }

  const blocksForRewrite = rewriteData.blocks.filter(
    (b: any) => ['paragraph'].includes(b.type) && b.data?.text
  )
  const blocksRewrited = rewriteData.blocks.filter(
    (b: any) => b.rewriteDataSuggestions?.length
  )
  const status = rewriteData.status
  const data = {
    time: Date.now(),
    version: '2.2.2',
    blocks: rewriteData?.blocks,
  }
  const dataRewrite = {
    time: Date.now() + 1,
    version: '2.2.2',
    blocks: rewriteData.blocks.map((b: any) => {
      return { ...b, data: b.rewriteDataSuggestions[0] || b.data }
    }),
  }

  const percent =
    status === 9
      ? 100
      : ((blocksRewrited.length + 1) / (blocksForRewrite.length + 1)) * 100

  const isCompleted = status === 9 || percent === 100

  const isShowResult =
    isCompleted || blocksRewrited.length === blocksForRewrite.length

  const [origEditor] = useState(
    () =>
      new EditorJS({
        holder: 'orig',
        tools: EDITOR_JS_TOOLS,
        data,
        readOnly: true,
      })
  )
  const [rewriteEditor] = useState(
    isShowResult &&
      new EditorJS({
        holder: 'rewrite',
        tools: EDITOR_JS_TOOLS,
        data: dataRewrite,
      })
  )

  return (
    <>
      <div className="min-h-full w-full card bg-base-200">
        <main>
          <div className="max-w-7xl">
            <div className="px-4 sm:px-0">
              <div className="mb-1 md:mb-0 w-full p-1">
                <div className={'alert ' + getBackgroundColorByStatus(status)}>
                  <div className="flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 mx-2 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <label className="w-full">
                      {translate('TaskStatus')}:{' '}
                      {translate(
                        getRewriterStatusText(
                          isCompleted ? 9 : rewriteData.status
                        )
                      ).toLowerCase()}{' '}
                      ({isCompleted ? '100.00' : percent.toFixed(2)}
                      %){' '}
                      {!isCompleted && (
                        <button className="btn btn-ghost btn-sm btn-circle loading"></button>
                      )}
                      {!isCompleted && (
                        <div className="w-full">
                          <progress
                            className="w-full progress progress-info"
                            value={percent}
                            max={100}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-1 md:mb-0 w-full p-2">
                <label className="text-white">
                  {translate('SelectedTargetLang')}
                </label>
                <select
                  name="targetLang"
                  value={rewriteData.targetLang}
                  disabled
                  className="select select-bordered select-warning w-full"
                >
                  <option value={1}>Russian</option>
                  <option value={0}>English</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label className="text-white">
                    {translate('Original text')}
                  </label>
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <div id="orig"></div>
                  </div>
                </div>

                {isShowResult && (
                  <div className="mb-1 md:mb-0 w-full p-2 ">
                    <label className="text-white">{'Rewrited text'}</label>
                    <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                      <div id="rewrite"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default RewriterResultPage
