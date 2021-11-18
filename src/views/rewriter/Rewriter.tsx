/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, createRef } from 'preact/compat'
import { HOST_API, headers } from 'helpers/api'
import { Navigate } from 'react-router-dom'
import { ReactEditor } from 'components/Editorjs'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useState } from 'preact/hooks'

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
  targetLang: number
  editorData: any
  setShowRewriteContent: (arg: boolean) => void
  setLinkResult: (arg: string) => void
}
async function addQueue({
  editorData,
  targetLang,
  setShowRewriteContent,
  setLinkResult,
}: TQueueOpts) {
  // const editorApi = this.reactEditorRef?.current?.state?.api

  if (!editorData?.blocks?.length) {
    return
  }

  setShowRewriteContent(false)

  const resp = await fetch(`${HOST_API}/api/rewriteText/add`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      targetLang,
      blocks: editorData.blocks,
    }),
    mode: 'cors',
  })

  if (!resp.ok) {
    setShowRewriteContent(true)
    return alert('TryAgainLater')
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
  const [targetLang, setTargetLang] = useState(1)
  const [rewriteLevel, setRewriteLevel] = useState(1)
  const reactEditorRef = createRef<any>()

  if (!showRewriteContent) {
    return <div className="h-96">{translate('loading')}</div>
  }
  const placeholder = 'EnterTextForRewritePlaceholder'

  return (
    <>
      <div className=" w-full card bg-base-200 p-5">
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label className="">{'EnterTextForRewrite'}</label>
          <div
            className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3"
            style={{ minHeight: '300px' }}
          >
            <ReactEditor ref={reactEditorRef} placeholder={placeholder} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="mb-1 md:mb-0 w-full p-2">
            <label className="text-white-700">
              {translate('SelectTargetLang')}
            </label>
            <select
              defaultValue={targetLang}
              onChange={(val) => {
                setTargetLang(parseInt(val.target.value, 10))
              }}
              className="select w-full select-bordered select-primary "
            >
              <option value={1}>Russian</option>
              <option value={0}>English</option>
            </select>
          </div>
          {/* <div className="mb-1 md:mb-0 w-full p-2">
            <label className="text-white-700">{'SelectRewriteLevel'}</label>
            <select
              defaultValue={rewriteLevel}
              onChange={(val) => {
                this.setState({
                  rewriteLevel: parseInt(val.target.value, 10),
                })
              }}
              disabled
              className="select w-full select-bordered select-primary "
            >
              <option value={1}>Light</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </div> */}
        </div>

        <div className="flex-auto space-x-3 my-6 flex items-center">
          <button
            // disabled={!editorData?.blocks?.length}
            onClick={() =>
              addQueue({
                targetLang,
                editorData: reactEditorRef?.current?.state?.editorData,
                setShowRewriteContent,
                setLinkResult,
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
