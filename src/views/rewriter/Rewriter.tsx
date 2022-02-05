/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dataset, LangCode, RewriteMode, TaskStatus } from 'dprx-types'
import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { FC } from 'preact/compat'
import { LangApi, RewriteApi } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { ToneMode } from 'components/Select/Tone'
import { smiles } from 'helpers/smiles'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'
import useQueueCount from 'hooks/useQueueCount'

const editorId = 'holder_rewrite'

export const RewriterPage: FC = () => {
  const { translate } = useLocalize()
  const [linkResultId, setLinkResult] = useState('')
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  if (linkResultId) {
    return <Navigate to={`/rewrite/result/${linkResultId}`} />
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="text-center">
            <h1 className="mt-4 text-5xl font-bold">
              {translate('RewriterTitle')}
              <img src={smileSrc} className="inline px-4" />
            </h1>
          </div>

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
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }

  const { queueCount = 0, queueChars = 0 } = useQueueCount()
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
        <div className="mb-1 w-full text-center">
          <div>
            {translate('Queue', { count: queueCount })}
            {/* {queueCount > 100 &&
              translate('QueueCharsCount', { chars: queueChars })} */}
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
              targetLang === LangCode.Russian ? 'hidden' : ''
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
