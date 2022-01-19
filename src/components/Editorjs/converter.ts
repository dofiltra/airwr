/* eslint-disable @typescript-eslint/no-explicit-any */
export function jsonToHtml(jsonStr: string) {
  const obj = JSON.parse(jsonStr)

  let html = ''
  obj['blocks'].forEach(function (block: any) {
    const data = block?.data
    const {
      text,
      level,
      html: htmlRaw,
      style,
      items = [],
      lang,
      code,
      file,
    } = data
    const lsType = style === 'ordered' ? 'ol' : 'ul'

    switch (block['type']) {
      case 'paragraph':
        html += `<p>${text}</p>`
        break

      case 'header':
        html += `<h${level}>${text}</h${level}>`
        break

      case 'raw':
        html += htmlRaw
        break

      case 'list':
        html += '<' + lsType + '>'
        items.forEach(function (item: any) {
          html += '<li>' + item + '</li>'
        })
        html += '</' + lsType + '>'
        break

      case 'code':
        html +=
          '<pre><code class="language-' + lang + '">' + code + '</code></pre>'
        break

      case 'image':
        html += '<div class="img_pnl"><img src="' + file?.url + '" /></div>'
        break
    }
  })

  return html
}
