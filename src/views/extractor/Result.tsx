/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Doextractor, SocketEvent, TaskStatus } from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { HOST_API } from 'helpers/api'
import { LoadingContainer } from 'components/Containers/Loader'
import { QueueContainer } from 'components/Containers/PageContainers'
import { getBackgroundColorByStatus, getStatusText } from 'helpers/task'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'preact/compat'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import EditorJS from '@editorjs/editorjs'

const editorId = 'holder_extractor'

const ResultPage = () => {
  const { id = '' } = useParams()
  const { translate } = useLocalize()
  const [data, setData] = useState({} as Doextractor)
  const [queue, setQueue] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, {
          roomId: `${SocketEvent.ExtractorPrefix}${id}`,
        })
        socket.emit(SocketEvent.SendQueue, {})
      })

      socket.on(SocketEvent.SendQueue, (queue: any) => {
        setQueue(queue)
      })

      socket.on(SocketEvent.AibackUpdate, (data: any) => {
        if ((data as any)?._id !== id) {
          return
        }

        setData(data)
        if (data?.status === TaskStatus.Completed) {
          socket?.disconnect()
        }
      })
    })
  }, [id])

  useEffect(() => {
    if (data.status === TaskStatus.Completed) {
      const twiScript = document.createElement('script')
      twiScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
      twiScript.setAttribute('async', 'true')
      document.body.appendChild(twiScript)

      const instagramScript = document.createElement('script')
      instagramScript.setAttribute('src', 'https://www.instagram.com/embed.js')
      instagramScript.setAttribute('async', 'true')
      document.body.appendChild(instagramScript)
    }
  }, [data])

  if (!Object.keys(data || {})?.length) {
    return <LoadingContainer />
  }

  const isCompleted = data.status === TaskStatus.Completed
  const unionContent = data?.union?.content

  if (unionContent) {
    useEffect(() => {
      const unionEditor: EditorJS = new EditorJS({
        holder: editorId,
        tools: EDITOR_JS_TOOLS,
        placeholder: translate('Loading'),
        autofocus: true,
        inlineToolbar: true,
        hideToolbar: true,
        onReady: async () => {
          // const cleanHtml = unionEditor.sanitizer.clean(
          //   `${unionContent}`,
          //   sanitizerConfig
          // )

          // const { blocks = [] } = await ExtractorApi.html2blocks(cleanHtml)
          // unionEditor.clear()

          // if (blocks.length) {
          //   return await unionEditor.render({ blocks })
          // }

          return await unionEditor.blocks.renderFromHTML(unionContent)
        },
      })
    }, [unionContent, translate])
  }

  return (
    <>
      <div className="min-h-full w-full card">
        <main>
          <div className="max-w-7xl">
            <div className="px-4 sm:px-0">
              <QueueContainer {...queue} />

              <div className="mb-1 md:mb-0 w-full p-1">
                <div
                  className={'alert ' + getBackgroundColorByStatus(data.status)}
                >
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
                      {translate(getStatusText(data.status)).toLowerCase()}{' '}
                      {!isCompleted && (
                        <button className="btn btn-sm btn-circle loading"></button>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="mb-1 w-full p-2 m-2">
                  <h2>{translate('Group urls/keywords')}</h2>
                  <ol className="">
                    {data.urlsOrKeys.map((urlOrKey) => (
                      <li>{urlOrKey}</li>
                    ))}
                  </ol>
                </div>

                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
                    <h2>
                      {data.union?.title || translate('Union article')}{' '}
                      {!isCompleted && (
                        <button className="btn btn-circle loading"></button>
                      )}
                    </h2>
                    <hr />
                    {/* <div
                      className={`p-2 overflow-auto ${
                        isCompleted ? 'h-auto' : ''
                      }`}
                      contentEditable
                      style={{ background: '#fff' }}
                      dangerouslySetInnerHTML={{
                        __html: `${unionContent || ''}`,
                      }}
                    ></div> */}
                    <div id={editorId}></div>
                  </div>
                </div>

                {/* {!unionBlocks.length && (
                  <div className="mb-1 md:mb-0 w-full p-2 ">
                    <div className="collapse w-full border rounded-box border-base-300 collapse-open">
                      <div
                        className="collapse-title text-xl font-medium border-b-2"
                        style={{ background: '#e1f5fe' }}
                      >
                        {data.union?.title || translate('Union article')}{' '}
                        {!isCompleted && (
                          <button className="btn btn-circle loading"></button>
                        )}
                      </div>
                      <div
                        className={`collapse-content overflow-auto ${
                          isCompleted ? 'h-80' : ''
                        }`}
                        style={{ background: '#fff' }}
                        dangerouslySetInnerHTML={{
                          __html: `${data.union?.content || ''}`,
                        }}
                      ></div>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="grid grid-cols-1 gap-1">
                <hr className="mt-6 border-2 border-dashed" />
                <div className="mb-1 w-full p-2 m-2">
                  <h2>
                    {translate('Extracted urls')}{' '}
                    {!isCompleted && (
                      <button className="btn btn-circle loading"></button>
                    )}
                  </h2>

                  <ol className="">
                    {data?.results
                      ?.filter((doread) => doread?.url)
                      .map((doread) => (
                        <li>
                          <a href={doread.url} target={'_blank'}>
                            {doread.url}
                          </a>
                        </li>
                      ))}
                  </ol>
                </div>

                <div className="collapse w-full">
                  <div
                    className="collapse-title text-xl font-medium "
                    style={{ background: '#e1f5fe' }}
                  >
                    {translate('Original articles')} (
                    {data?.results?.length || 0}){' '}
                    {!isCompleted && (
                      <button className="btn btn-circle loading"></button>
                    )}
                  </div>
                </div>

                {data?.results
                  ?.filter((doread) => doread?.content)
                  .map((doread) => {
                    return (
                      <div className="mb-1 md:mb-0 w-full p-2 ">
                        <div className="collapse  w-full border rounded-box border-base-300 collapse-arrow bg-white">
                          <input type="checkbox" />
                          <div
                            className="collapse-title text-xl font-medium border-b-2"
                            style={{ background: '#fff' }}
                          >
                            {doread.url}
                          </div>
                          <div
                            className="collapse-content"
                            style={{ background: '#fff' }}
                            dangerouslySetInnerHTML={{
                              __html: `<h1>${doread.title || ''}</h1><br/>${
                                doread.content ||
                                translate('Article not found!')
                              }`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default ResultPage
