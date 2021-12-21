/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckList from '@editorjs/checklist'
// import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'

class DoParagraph extends Paragraph {
  render() {
    const wrapper = super.render()

    if (this.data?.withBackground) {
      wrapper.style.backgroundColor = '#e8f5e9'
    }

    return wrapper
  }
}

class DoList extends List {
  constructor(settings: any) {
    super(settings)
    const { data } = settings

    this._data = {
      ...this._data,
      withBackground: data?.withBackground,
    }
  }

  render() {
    const wrapper = super.render()

    if (this.data?.withBackground) {
      wrapper.style.backgroundColor = '#ecf5ed'
    }

    return wrapper
  }
}

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: DoList as any,
  warning: Warning,
  // code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  paragraph: DoParagraph as any,
}
