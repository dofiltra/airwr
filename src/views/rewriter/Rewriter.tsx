/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dataset,
  LangCode,
  ModuleName,
  RewriteMode,
  SocketEvent,
  TaskStatus,
} from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { FC } from 'preact/compat'
import {
  HostManager,
  LoadingContainer,
  PageH1,
  QueueContainer,
} from '@dofiltra/tailwind'
import { LangApi, RewriteApi } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { Navigate } from 'react-router-dom'
import { ToneMode } from 'components/Select/Tone'
import { io } from 'socket.io-client'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'

const editorId = 'holder_rewrite'

export const RewriterPage: FC = () => {
  const { translate } = useLocalize()
  const [linkResultId, setLinkResult] = useState('')

  if (linkResultId) {
    return <Navigate to={`/${ModuleName.Rewriter}/result/${linkResultId}`} />
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <PageH1 title={translate('RewriterTitle')} />
          <RewriteContent setLinkResult={setLinkResult} />
        </main>
      </div>
    </>
  )
}

type TQueueOpts = {
  targetLang: LangCode
  expand: RewriteMode.Longer | RewriteMode.Shorter
  tone: RewriteMode.Formal | RewriteMode.Casual
  power: number
  token: string
  translate: any
  api: any
  setVisibleContent: (arg: boolean) => void
  setLinkResult: (arg: string) => void
}

async function addQueue({
  api,
  targetLang,
  power,
  setVisibleContent,
  setLinkResult,
  translate,
  token,
  expand,
  tone,
}: TQueueOpts) {
  const editorData = await api.saver.save()
  if (!editorData?.blocks?.length) {
    return
  }

  setVisibleContent(false)

  const { result, error } = await RewriteApi.add({
    targetLang,
    power,
    expand,
    token,
    tone,
    blocks: editorData.blocks,
    dataset: Dataset.Auto,
    status: TaskStatus.NotStarted,
  })

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

const RewriteContent: FC<{ setLinkResult: any }> = ({ setLinkResult }) => {
  const { translate } = useLocalize()
  const [isVisibleContent, setVisibleContent] = useState(true)
  const [targetLang, setTargetLang] = useState(LangCode.Russian)
  const [expand, setExpand] = useState(
    ExpandMode[0].value as RewriteMode.Longer | RewriteMode.Shorter
  )
  const [tone, setTone] = useState(
    ToneMode[0].value as RewriteMode.Formal | RewriteMode.Casual
  )
  const [power, setPower] = useState(0.5)

  if (!isVisibleContent) {
    return <LoadingContainer loadingText={translate('Loading')} />
  }

  const { user } = useContext(AuthContext)
  const token = user?.uid || ''
  const [queue, setQueue] = useState({} as any)

  useEffect(() => {
    fetch(`${HostManager.getHostWs()}/api/socketio/exec`).finally(() => {
      const socket = io(HostManager.getHostWs()!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, {
          roomId: `RWR-${token}`,
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
        placeholder: translate('EnterTextForRewritePlaceholder'),
        autofocus: true,
        inlineToolbar: false,
        hideToolbar: true,
        data: {
          time: Date.now(),
          version: '2.2.2',
          blocks: AppStore.lastBlocks || [],
        },
        onChange: () => {
          const detect = async () => {
            const editorData = await api.saver.save()
            if (!editorData?.blocks?.length) {
              return
            }

            const text = editorData.blocks
              .map((x: any) => x?.data?.text)
              .filter((x: any) => x)
              .join(' ')
              .slice(0, 1e3)

            const detectResult = await LangApi.detect(text)
            if (detectResult?.length) {
              const [lang] = detectResult
              const code = lang?.code?.toUpperCase()
              code && setTargetLang(code)
            }
          }
          detect()
        },
      })
  )

  return (
    <>
      <div className="w-full card p-4">
        {/* <p className="text-center" style={{color: 'red'}}>Рерайтер временно отключен, идут работы...</p> */}
        <QueueContainer
          count={translate('Queue', { count: queue?.count || '...' })}
        />

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label className="">{translate('EnterTextForRewrite')}</label>
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            <div id={editorId}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div
            className={`mb-1 md:mb-0 w-full p-2 ${
              '' //targetLang === LangCode.Russian ? 'hidden' : ''
            }`}
          >
            <label className="text-white-700">
              {translate('SelectTargetLang')}
            </label>
            <LangBox
              value={targetLang}
              onChange={(val: any) => {
                setTargetLang(val.target.value)
              }}
              className="select w-full select-bordered select-primary "
            />
          </div>
          <div className="mb-1 md:mb-0 w-full p-2">
            <label className="text-white-700">
              {translate('SelectExpand')}
            </label>
            <ExpandBox
              value={expand}
              onChange={(val: any) => {
                setExpand(val.target.value)
              }}
              className="select w-full select-bordered select-primary "
            />
          </div>
          <div className="mb-1 md:mb-0 w-full p-2">
            <label className="text-white-700">
              {translate('SelectRewritePower')} ({(power * 100).toFixed(0)}%)
            </label>
            <input
              type="range"
              max={100}
              min={0}
              value={power * 100}
              onChange={(e) => setPower(parseInt(e.target.value, 10) / 100)}
              className={'range'}
            />
          </div>
        </div>

        <div className="flex-auto space-x-3 my-6 flex items-center">
          <button
            // disabled={!editorData?.blocks?.length}
            onClick={() =>
              addQueue({
                api,
                targetLang,
                power,
                setVisibleContent,
                setLinkResult,
                translate,
                token,
                expand,
                tone,
              })
            }
            className="w-full btn btn-success"
          >
            {translate('ButtonSend')}
          </button>
        </div>
      </div>
    </>
  )
}
