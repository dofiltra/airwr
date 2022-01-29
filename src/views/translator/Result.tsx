/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dotranslate, SocketEvent, TaskStatus } from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { FC, useEffect, useState } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { Loading } from 'components/Containers/Loader'
import { getRewriterStatusText } from 'helpers/rewriter'
import { io } from 'socket.io-client'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'
import useTranslateQueue from 'hooks/useTranslateQueue'

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

const TranslateResultPage: FC<TResultPage> = () => {
  const { id = '' } = useParams()
  const { translate } = useLocalize()
  const { queueCount = 0, queueChars = 0 } = useTranslateQueue()
  const [translateData, setTranslateData] = useState({} as Dotranslate)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, {
          roomId: `${SocketEvent.TranslatePrefix}${id}`,
        })
      })

      socket.on(SocketEvent.AibackUpdate, (data: any) => {
        data && setTranslateData(data)
        if (data?.status === TaskStatus.Completed) {
          socket?.disconnect()
        }
      })
    })
  }, [id])

  if (!translateData?.blocks?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }

  const blocksForTranslate = translateData.blocks.filter(
    (b: any) => b.data?.text || b.data?.items?.length
  )
  const blocksTranslated = translateData.blocks.filter(
    (b: any) => Object.keys(b?.results || {}).length
  )
  const status = translateData.status
  const data = {
    time: Date.now(),
    version: '2.2.2',
    blocks: translateData?.blocks,
  }
  const dataTranslates = translateData.langs.map((lang, i) => {
    return {
      lang,
      time: Date.now() + i + 1,
      version: '2.2.2',
      blocks: translateData.blocks.map((b: any) => {
        const resultData = b.results && b.results[lang]
        return {
          ...b,
          data: {
            ...(resultData || b.data),
            withBackground: !!(b.results && b.results[lang]),
          },
        }
      }),
    }
  })

  const percent =
    status === TaskStatus.Completed
      ? 100
      : blocksForTranslate.length &&
        (blocksTranslated.length / blocksForTranslate.length) * 100

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

  const [editors] = useState(() =>
    dataTranslates.map((dataTranslate, i) => {
      const editor = new EditorJS({
        holder: `${SocketEvent.TranslatePrefix}${translateData.langs[i]}`,
        tools: EDITOR_JS_TOOLS,
        data: dataTranslate,
      })

      return { editor, dataTranslate }
    })
  )

  editors.forEach(({ editor, dataTranslate }) => {
    const data = dataTranslates.find((x) => x.lang === dataTranslate.lang)
    if (data && editor?.clear) {
      editor.clear()
      editor.render(data)
    }
  })

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
                            : translateData.status
                        )
                      ).toLowerCase()}{' '}
                      ({isCompleted ? '100.00' : percent.toFixed(2)}
                      %){' '}
                      {!isCompleted && (
                        <button className="btn btn-sm btn-circle loading"></button>
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

              <div className="grid grid-cols-1 gap-1">
                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label>{translate('Original text')}</label>
                  <div className="editor-wrapper h-96 overflow-auto w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <div id="orig"></div>
                  </div>
                </div>
              </div>

              {translateData.langs.map((lang) => {
                return (
                  <div className="grid grid-cols-1 gap-1">
                    <div className="mb-1 md:mb-0 w-full p-2 ">
                      <label>
                        {lang}{' '}
                        {!isCompleted && (
                          <button className="btn btn-circle loading"></button>
                        )}
                      </label>
                      <div className="editor-wrapper h-96 overflow-auto w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                        <div id={`translate_${lang}`}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default TranslateResultPage
