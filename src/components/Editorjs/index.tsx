/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from 'react'
import { EDITOR_JS_TOOLS } from './constants'
import { createReactEditorJS } from 'react-editor-js'

const ReactEditorJS = createReactEditorJS()

type TEditorState = {
  api: any
  editorData: { blocks?: any[] }
}
export class ReactEditor extends Component<any, TEditorState> {
  constructor(props: any) {
    super(props)
    this.state = {
      editorData: {},
      api: null,
    }
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { key = Math.random().toString(), holder } = this.props

    return (
      <ReactEditorJS
        key={key}
        holder={holder || key}
        tools={EDITOR_JS_TOOLS}
        // onReady={() => {
        //   console.log('Editor.js is ready to work!')
        // }}
        onChange={(api: any) => {
          api.saver.save().then((editorData: any) => {
            this.setState({ api, editorData })
            if (!this.state.editorData.blocks?.length) {
              api.blocks.insertNewBlock()
            }
          })
        }}
        {...this.props}
      />
    )
  }
}
