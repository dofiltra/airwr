/* eslint-disable @typescript-eslint/no-explicit-any */
import { HOST_API, headers } from 'helpers/api'
import { ReactEditor } from 'components/Editorjs'
import { getRewriterStatusText } from 'helpers/rewriter'
import React from 'react'

type TRewriterResultPagetate = {
  notFound: boolean
  originalData?: any
}

export default class RewriterResultPage extends React.Component<
  any,
  TRewriterResultPagetate
> {
  constructor(props?: any) {
    super(props)

    this.state = {
      notFound: false,
      originalData: null,
    }
  }

  async componentDidMount() {
    await this.loadData()
  }

  render() {
    return (
      <>
        <div className="min-h-full">
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 sm:px-0">{this.RewriteResultContent()}</div>
            </div>
          </main>
        </div>
      </>
    )
  }

  RewriteResultContent() {
    const { originalData, notFound } = this.state

    if (notFound) {
      return <>{'Rewrite result not found'}</>
    }

    if (!originalData?.blocks?.length) {
      return <>{'Loading'}</>
    }

    const blocksForRewrite = originalData.blocks.filter(
      (b: any) => ['paragraph'].includes(b.type) && b.data?.text
    )
    const blocksRewrited = originalData.blocks.filter(
      (b: any) => b.rewriteDataSuggestions?.length
    )
    const status = originalData.status
    const data = {
      time: Date.now(),
      version: '2.2.2',
      blocks: originalData.blocks,
    }
    const dataRewrite = {
      time: Date.now() + 1,
      version: '2.2.2',
      blocks: originalData.blocks.map((b: any) => {
        return { ...b, data: b.rewriteDataSuggestions[0] || b.data }
      }),
    }

    const isCompleted = status === 9
    const isShowResult =
      isCompleted || blocksRewrited.length === blocksForRewrite.length

    return (
      <>
        <div className="mb-1 md:mb-0 w-full p-1">
          <label
            className="text-gray-700 p-2"
            style={{
              backgroundColor: this.getBackgroundColorByStatus(
                originalData.status
              ),
            }}
          >
            {'TaskStatus'}:{' '}
            {getRewriterStatusText(originalData.status).toLowerCase()} (
            {isCompleted
              ? '100.00'
              : (
                  (blocksRewrited.length / blocksForRewrite.length) *
                  100
                ).toFixed(2)}
            %)
          </label>
        </div>

        <div className="mb-1 md:mb-0 w-full p-2">
          <label className="text-gray-700">{'SelectedTargetLang'}</label>
          <select
            name="targetLang"
            value={originalData.targetLang}
            disabled
            className="h-10 pl-3 pr-6 text-base w-full placeholder-gray-600 border rounded-lg focus:shadow-outline"
          >
            <option value={1}>Russian</option>
            <option value={0}>English</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="mb-1 md:mb-0 w-full p-2">
            <label className="text-gray-700">{'Original text'}</label>
            <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
              <ReactEditor holder="orig" readOnly={true} data={data} />
            </div>
          </div>

          {isShowResult && (
            <div className="mb-1 md:mb-0 w-full p-2">
              <label className="text-gray-700">{'Rewrited text'}</label>
              <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                <ReactEditor holder="rewrite" data={dataRewrite} />
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  private getBackgroundColorByStatus(status: number) {
    switch (status) {
      case 3: // inProgrss
        return '#e1f5fe'
      case 9: // completed
        return '#dcedc8'
    }

    return '#e0e0e0'
  }

  private async loadData() {
    const { params } = this.props
    const resp = await fetch(
      `${HOST_API}/api/rewriteText/get?id=${params.id}`,
      {
        headers,
        method: 'GET',
        mode: 'cors',
      }
    )

    if (!resp.ok) {
      this.setState({ notFound: true })
      return alert('TryAgainLater')
    }

    const { item: originalData } = await resp.json()
    console.log(originalData)
    this.setState({ originalData, notFound: !originalData })
  }
}
