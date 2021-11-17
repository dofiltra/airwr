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
      return '#e1f5fe'
    case 9: // completed
      return '#dcedc8'
  }

  return '#e0e0e0'
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
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              <div className="mb-1 md:mb-0 w-full p-1">
                <label
                  className="text-gray-700 p-2"
                  style={{
                    backgroundColor: getBackgroundColorByStatus(
                      rewriteData.status
                    ),
                  }}
                >
                  {'TaskStatus'}:{' '}
                  {getRewriterStatusText(rewriteData.status).toLowerCase()} (
                  {isCompleted
                    ? '100.00'
                    : (
                        (blocksRewrited.length / blocksForRewrite.length) *
                        100
                      ).toFixed(2)}
                  %)
                </label>
              </div>

              <div className="mb-1 md:mb-0 w-full p-2">
                <label className="text-gray-700">{'SelectedTargetLang'}</label>
                <select
                  name="targetLang"
                  value={rewriteData.targetLang}
                  disabled
                  className="h-10 pl-3 pr-6 text-base w-full placeholder-gray-600 border rounded-lg focus:shadow-outline"
                >
                  <option value={1}>Russian</option>
                  <option value={0}>English</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="mb-1 md:mb-0 w-full p-2 card bg-base-200">
                  <label className="text-gray-700">{'Original text'}</label>
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <ReactEditor holder="orig" readOnly={true} data={data} />
                  </div>
                </div>

                {isShowResult && (
                  <div className="mb-1 md:mb-0 w-full p-2 card bg-base-200">
                    <label className="text-gray-700">{'Rewrited text'}</label>
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
