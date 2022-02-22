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

class DoHeader extends Header {
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
  list: { class: DoList, inlineToolbar: true },
  warning: Warning,
  // code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: { class: DoHeader, inlineToolbar: true },
  quote: { class: Quote, inlineToolbar: true },
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  paragraph: { class: DoParagraph, inlineToolbar: true },
}

export const sanitizerConfig = {
  iframe: true,
  video: {
    src: true,
    controls: true,
  },
  audio: {
    controls: true,
  },
  source: {},
  figure: {
    // 'class':true,
  },
  figcaption: {},
  img: true,
  p: {},
  div: {
    // 'class':true,
  },
  section: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  label: {},
  blockquote: {},
  ins: {},
  pre: {},
  center: {},
  strong: {},
  b: {},
  i: {},
  u: {},
  sub: {},
  sup: {},
  del: {},
  small: {},
  ol: {
    // role: true,
    // start: true,
    // type: true,
  },
  ul: {
    // type: true,
  },
  li: {
    // value: true,
  },
  br: {},
  em: {},
  span: {},
  dl: {},
  dt: {},
  dd: {},
  cite: {},
  table: {},
  thead: {},
  tfoot: {},
  tbody: {},
  th: {},
  tr: {},
  td: {
    rowspan: true,
    colspan: true,
  },
}
