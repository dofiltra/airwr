/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BlockContent,
  Dotranslate,
  LangCode,
  ModuleName,
  SocketEvent,
  TaskStatus,
} from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { HOST_API, LangApi, TranslateApi } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { LoadingContainer } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { PageH1, QueueContainer } from 'components/Containers/PageContainers'
import { io } from 'socket.io-client'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'

const editorId = 'holder_translate'

export default () => {
  const { translate } = useLocalize()
  const [isVisibleContent, setVisibleContent] = useState(true)
  const [linkResultId, setLinkResult] = useState('')

  if (linkResultId) {
    return <Navigate to={`/${ModuleName.Translator}/result/${linkResultId}`} />
  }

  if (!isVisibleContent) {
    return <LoadingContainer />
  }

  const [langs, setLangs] = useState([] as LangCode[])
  const [currentLang, setCurrentLang] = useState('' as LangCode)
  const { user } = useContext(AuthContext)
  const token = user?.uid || ''
  const [queue, setQueue] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, {
          roomId: `TRANSL-${token}`,
        })
        socket.emit(SocketEvent.SendQueue, {})
      })

      socket.on(SocketEvent.SendQueue, (queue: any) => {
        setQueue(queue)
      })
    })
  }, [token])

  const [api] = useState(
    () =>
      new EditorJS({
        holder: editorId,
        tools: EDITOR_JS_TOOLS,
        placeholder: translate('EnterTextForTranslatePlaceholder'),
        autofocus: true,
        inlineToolbar: false,
        hideToolbar: true,
        onChange: () => {
          const detect = async () => {
            const editorData = await api.saver.save()
            if (!editorData?.blocks?.length) {
              console.log('no blocks')

              return
            }

            const text = editorData.blocks
              .map((x: any) => x?.data?.text || x?.items?.join(' '))
              .filter((x: any) => x)
              .join(' ')
              .slice(0, 1e3)

            const detectResult = await LangApi.detect(text)
            if (detectResult?.length) {
              const [lang] = detectResult
              const code = lang?.code?.toUpperCase()
              console.log(code)

              code && setCurrentLang(code)
            }
          }

          detect()
        },
      })
  )

  return (
    <>
      <div className="min-h-full">
        <main>
          <PageH1 title={translate('TranslatorTitle')} />

          <div className="w-full card p-4">
            <QueueContainer {...queue} />

            <div className="mb-1 md:mb-0 w-full p-2 ">
              <label className="">{translate('EnterTextForTranslate')}</label>
              <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
                <div id={editorId}></div>
              </div>
            </div>

            <div className="mb-1 md:mb-0 w-full p-2 ">
              <span className="text-gray-700">
                {translate('Select langs for Translate')}
              </span>
              <LangBox
                exclude={[currentLang]}
                value={langs}
                onChange={(val: any) => {
                  setLangs(
                    Array.from(val.target.selectedOptions, (o: any) => o.value)
                  )
                }}
                className="form-multiselect block w-full h-48 mt-1  border-2 border-dashed border-gray-100 "
                multiple
              />
            </div>

            <div className="flex-auto space-x-3 my-6 flex items-center">
              <button
                // disabled={!editorData?.blocks?.length}
                onClick={() => {
                  const add = async () => {
                    const editorData = await api.saver.save()
                    if (!editorData?.blocks?.length) {
                      return
                    }

                    setVisibleContent(false)

                    const { result, error } = await TranslateApi.add({
                      token,
                      langs,
                      blocks: editorData.blocks as BlockContent[],
                      status: TaskStatus.NotStarted,
                    } as Dotranslate)

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
          </div>
        </main>
      </div>
    </>
  )
}
