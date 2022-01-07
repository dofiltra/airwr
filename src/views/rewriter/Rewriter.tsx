/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { FC } from 'preact/compat'
import { HOST_API, detectLang, headers } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { ToneMode } from 'components/Select/Tone'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'
import useRewriteQueue from 'hooks/useRewriteQueue'

const editorId = 'holder1'

export const RewriterPage: FC = () => {
  const [linkResultId, setLinkResult] = useState('')

  if (linkResultId) {
    return <Navigate to={`/rewrite/result/${linkResultId}`} />
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="">
              <RewriteContent setLinkResult={setLinkResult} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

type TQueueOpts = {
  targetLang: string
  expand: string
  tone: string
  power: number
  token: string
  translate: any
  api: any
  setShowRewriteContent: (arg: boolean) => void
  setLinkResult: (arg: string) => void
}
async function addQueue({
  api,
  targetLang,
  power,
  setShowRewriteContent,
  setLinkResult,
  translate,
  token,
  expand,
}: TQueueOpts) {
  const editorData = await api.saver.save()
  if (!editorData?.blocks?.length) {
    return
  }

  setShowRewriteContent(false)

  const resp = await fetch(`${HOST_API}/api/rewriteText/add`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      targetLang,
      power,
      expand,
      token,
      blocks: editorData.blocks,
      dataset: 0,
    }),
    mode: 'cors',
  })

  if (!resp.ok) {
    setShowRewriteContent(true)
    return alert(translate('TryAgainLater'))
  }

  const { result, error } = await resp.json()

  if (result?._id) {
    setLinkResult(result._id)
  }
  if (error || result?.errors) {
    alert(JSON.stringify(error || result?.errors || {}))
  }
}

const RewriteContent: FC<{ setLinkResult: any }> = ({ setLinkResult }) => {
  const { translate } = useLocalize()
  const [showRewriteContent, setShowRewriteContent] = useState(true)
  const [targetLang, setTargetLang] = useState('RU')
  const [expand, setExpand] = useState(ExpandMode[0].value)
  const [tone, setTone] = useState(ToneMode[0].value)
  const [power, setPower] = useState(0.5)

  if (!showRewriteContent) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('loading')}</div>
        <Loading />
      </div>
    )
  }

  const { queueCount = 0, queueChars = 0 } = useRewriteQueue()
  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  const [api] = useState(
    () =>
      new EditorJS({
        holder: editorId,
        tools: EDITOR_JS_TOOLS,
        placeholder: translate('EnterTextForRewritePlaceholder'),
        autofocus: true,
        inlineToolbar: false,
        hideToolbar: true,
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

            const detectResult = await detectLang(text)
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
      <div className=" w-full card p-5">
        <div className="mb-1 md:mb-0 w-full p-2 text-center">
          <div>
            {translate('Queue', { count: queueCount })}
            {queueCount > 100 &&
              translate('QueueCharsCount', { chars: queueChars })}
          </div>
        </div>

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label className="">{translate('EnterTextForRewrite')}</label>
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            <div id={editorId}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div
            className={`mb-1 md:mb-0 w-full p-2 ${
              targetLang === 'RU' ? 'hidden' : ''
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
          <div className="mb-1 md:mb-0 w-full p-2 hidden">
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
          <div className="mb-1 md:mb-0 w-full p-2 hidden">
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
                setShowRewriteContent,
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
