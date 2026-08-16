import hljs from 'highlight.js/lib/common'

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const harden = (s) =>
  s.replace(/\t/g, '\u00a0\u00a0\u00a0\u00a0').replace(/ /g, '\u00a0')

// hljs 输出转内联样式并按行拆分：
// DOMParser 解析 → 深度遍历（span 查映射压样式栈）→ 文本节点层按 \n 拆行 + 空格硬化
export function highlightToLines(code, lang, tokenStyles) {
  let html = null
  if (lang && hljs.getLanguage(lang)) {
    try {
      html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch {
      html = null
    }
  }
  if (html == null) html = escapeHtml(code)

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
  const lines = []
  let cur = ''
  const flush = () => { lines.push(cur); cur = '' }

  const styleFor = (el) => {
    const parts = []
    for (const cls of el.classList) {
      if (tokenStyles[cls]) parts.push(tokenStyles[cls])
    }
    return parts.join('')
  }

  const walk = (node, inherited) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const segs = node.nodeValue.split('\n')
      segs.forEach((seg, i) => {
        const hard = harden(seg)
        const body = hard !== '' && inherited
          ? `<span style="${inherited}">${hard}</span>`
          : hard
        cur += body
        if (i < segs.length - 1) flush()
      })
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const extra = node.tagName === 'SPAN' ? styleFor(node) : ''
    const merged = extra ? inherited + extra : inherited
    for (const child of node.childNodes) walk(child, merged)
  }

  for (const child of doc.body.childNodes) walk(child, '')
  flush()
  while (lines.length && lines[lines.length - 1] === '') lines.pop()
  return lines.map((l) => (l === '' ? '\u00a0' : l))
}
