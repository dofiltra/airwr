/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOST_API, headers } from 'helpers/api'
import { Navigate } from 'react-router-dom'
import { ReactEditor } from 'components/Editorjs'
import React from 'react'

type TRewriterPagetate = {
  showRewriteContent: boolean
  linkResultId?: string
  targetLang: number
  rewriteLevel: number
}

export default class RewriterPage extends React.Component<
  any,
  TRewriterPagetate
> {
  private reactEditorRef: any

  constructor(props?: any) {
    super(props)
    this.state = {
      showRewriteContent: true,
      linkResultId: '',
      targetLang: 1,
      rewriteLevel: 1,
    }
    this.reactEditorRef = React.createRef()
  }

  render() {
    const { linkResultId } = this.state

    if (linkResultId) {
      return <Navigate to={`/rewrite/result/${linkResultId}`} />
    }

    return (
      <>
        <div className="min-h-full">
          <main>
            <div className="max-w-7xl ">
              <div className="">{this.RewriteContent()}</div>
            </div>
          </main>
        </div>
      </>
    )
  }

  private async addQueue() {
    const { targetLang } = this.state
    const editorData = this.reactEditorRef?.current?.state?.editorData
    // const editorApi = this.reactEditorRef?.current?.state?.api

    if (!editorData?.blocks?.length) {
      return
    }

    this.setState({ showRewriteContent: false })

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
      this.setState({ showRewriteContent: true })
      return alert('TryAgainLater')
    }

    const { result, error } = await resp.json()

    if (result?._id) {
      this.setState({ linkResultId: result._id })
    }
    if (error || result?.errors) {
      alert(JSON.stringify(error || result?.errors || {}))
    }
  }

  RewriteContent() {
    const { showRewriteContent, targetLang, rewriteLevel } = this.state
    // const editorData = this.reactEditorRef?.current?.state?.editorData

    if (!showRewriteContent) {
      return <div className="h-96">{'Loading'}</div>
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
              <ReactEditor
                ref={this.reactEditorRef}
                placeholder={placeholder}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="mb-1 md:mb-0 w-full p-2">
              <label className="text-white-700">{'SelectTargetLang'}</label>
              <select
                defaultValue={targetLang}
                onChange={(val) => {
                  this.setState({ targetLang: parseInt(val.target.value, 10) })
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
              onClick={() => this.addQueue()}
              className="w-full btn btn-success"
            >
              {'ButtonSend'}
            </button>
          </div>
        </div>
      </>
    )
  }
}
