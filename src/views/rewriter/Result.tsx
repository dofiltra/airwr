/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlockContent, RewriteText, SocketEvent, TaskStatus } from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { FC, useEffect, useState } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { Loading } from 'components/Containers/Loader'
import { getRewriterStatusText } from 'helpers/rewriter'
import { io } from 'socket.io-client'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'
import useRewriteQueue from 'hooks/useRewriteQueue'

type TResultPage = {
  //
}

function getBackgroundColorByStatus(status: number) {
  switch (status) {
    case TaskStatus.InProgress:
      return 'alert-info'
    case TaskStatus.Completed:
      return 'alert-success'
  }

  return ''
}

const RewriterResultPage: FC<TResultPage> = () => {
  const { id = '' } = useParams()
  const { translate } = useLocalize()
  const { queueCount = 0, queueChars = 0 } = useRewriteQueue()
  const [rewriteData, setRewriteData] = useState({} as RewriteText)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        const roomId = `${SocketEvent.RewritePrefix}${id}`
        socket?.emit(SocketEvent.Join, {
          roomId,
        })
      })

      socket.on(SocketEvent.AibackUpdate, (data: RewriteText) => {
        if ((data as any)?._id !== id) {
          return
        }

        setRewriteData(data)
        if (data?.status === TaskStatus.Completed) {
          socket?.disconnect()
        }
      })
    })
  }, [id])

  if (!rewriteData?.blocks?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }
  const status = rewriteData.status
  const blocksForRewrite = rewriteData.blocks.filter(
    (b: BlockContent) =>
      (['paragraph'].includes(b.type) && b.data?.text) ||
      (['list'].includes(b.type) && b.data?.items?.length)
  )
  const blocksRewrited = rewriteData.blocks.filter(
    (b: BlockContent) => b.rewriteDataSuggestions?.length
  )
  const data = {
    time: Date.now(),
    version: '2.2.2',
    blocks: rewriteData?.blocks,
  }
  const dataRewrite = {
    time: Date.now() + 1,
    version: '2.2.2',
    blocks: rewriteData.blocks.map((b: BlockContent) => {
      const sug = b.rewriteDataSuggestions || []
      return {
        ...b,
        data: {
          ...(sug[0] || b.data),
          withBackground: !!sug[0],
        },
      }
    }),
  }

  const percent =
    status === TaskStatus.Completed
      ? 100
      : blocksRewrited.length &&
        (blocksRewrited.length / blocksForRewrite.length) * 100

  const isCompleted = status === TaskStatus.Completed || percent === 100

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
      <div className="min-h-full w-full card">
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
                          isCompleted
                            ? TaskStatus.Completed
                            : rewriteData.status
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
                <label>{translate('SelectedTargetLang')}</label>
                <LangBox
                  value={rewriteData.targetLang}
                  disabled
                  className="select select-bordered select-warning w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label>{translate('Original text')}</label>
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <div id="orig"></div>
                  </div>
                </div>

                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label>{translate('Rewrited text')}</label>
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
