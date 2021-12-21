/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { FC, useEffect, useState } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { Loading } from 'components/Containers/Loader'
import { getRewriterStatusText } from 'helpers/rewriter'
import { io } from 'socket.io-client'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'
import useRewriteQueue from 'hooks/useRewriteQueue'

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
  const { translate } = useLocalize()
  const { queueCount = 0, queueChars = 0 } = useRewriteQueue()
  const [rewriteData, setRewriteData] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {})

      socket.on('connect', () => {
        socket.emit('join', { roomId: `RewriteText_${id}` })
      })

      socket.on('update', (data: any) => {
        console.log('update', data)
        data && setRewriteData(data)
      })
    })
  }, [id])

  if (!rewriteData?.blocks?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('loading')}</div>
        <Loading />
      </div>
    )
  }

  const blocksForRewrite = rewriteData.blocks.filter(
    (b: any) =>
      (['paragraph'].includes(b.type) && b.data?.text) ||
      (['list'].includes(b.type) && b.data?.items?.length)
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
      return {
        ...b,
        data: {
          ...(b.rewriteDataSuggestions[0] || b.data),
          withBackground: !!b.rewriteDataSuggestions[0],
        },
      }
    }),
  }

  const percent =
    status === 9
      ? 100
      : ((blocksRewrited.length + 1) / (blocksForRewrite.length + 1)) * 100

  const isCompleted = status === 9 || percent === 100

  // const isShowResult =
  //   isCompleted || blocksRewrited.length === blocksForRewrite.length

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
    () =>
      new EditorJS({
        holder: 'rewrite',
        tools: EDITOR_JS_TOOLS,
        data: dataRewrite,
      })
  )

  if (rewriteEditor?.clear) {
    rewriteEditor.clear()
    rewriteEditor.render(dataRewrite)
  }

  return (
    <>
      <div className="min-h-full w-full card bg-base-200">
        <main>
          <div className="max-w-7xl">
            <div className="px-4 sm:px-0">
              <div className="mt-4 md:mb-0 w-full text-center">
                <div>
                  {translate('Queue', { count: queueCount })}
                  {queueCount > 100 &&
                    translate('QueueCharsCount', { chars: queueChars })}
                </div>
              </div>

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

                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label className="text-white">
                    {translate('Rewrited text')}
                  </label>
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <div id="rewrite"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default RewriterResultPage
