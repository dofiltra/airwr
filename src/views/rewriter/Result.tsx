/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'preact/compat'
import { ReactEditor } from 'components/Editorjs'
import { getRewriterStatusText } from 'helpers/rewriter'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
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
  console.log('rewriteData', rewriteData)

  if (!rewriteData?.blocks?.length) {
    return <>{translate('loading')}</>
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

  const isCompleted = status === 9
  const isShowResult =
    isCompleted || blocksRewrited.length === blocksForRewrite.length

  return (
    <>
      <div className="min-h-full w-full card bg-base-200">
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                    <label>
                      {'TaskStatus'}:{' '}
                      {getRewriterStatusText(rewriteData.status).toLowerCase()}{' '}
                      (
                      {isCompleted
                        ? '100.00'
                        : (
                            (blocksRewrited.length / blocksForRewrite.length) *
                            100
                          ).toFixed(2)}
                      %)
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-1 md:mb-0 w-full p-2">
                <label className="text-white">{'SelectedTargetLang'}</label>
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
                  <label className="text-white">{'Original text'}</label>
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <ReactEditor holder="orig" readOnly={true} data={data} />
                  </div>
                </div>

                {isShowResult && (
                  <div className="mb-1 md:mb-0 w-full p-2 ">
                    <label className="text-white">{'Rewrited text'}</label>
                    <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                      <ReactEditor holder="rewrite" data={dataRewrite} />
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
