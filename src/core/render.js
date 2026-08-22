import MarkdownIt from 'markdown-it'
import { theme as defaultTheme } from './themes.js'
import { highlightToLines } from './highlight.js'

const md = new MarkdownIt({ html: false, linkify: false, breaks: false })

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---------- core rule: h1 数字前缀 → 描边色块（中性 token，渲染时取 env.theme） ----------
md.core.ruler.push('h1_number_chip', (state) => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i]
    if (t.type !== 'heading_open' || t.tag !== 'h1') continue
    const inline = tokens[i + 1]
    if (!inline || inline.type !== 'inline' || !inline.children || !inline.children.length) continue
    const first = inline.children[0]
    if (first.type !== 'text') continue
    const m = first.content.match(/^(\d{1,2})[\s、.．·]+/)
    if (!m) continue
    const rest = first.content.slice(m[0].length)
    const chip = [
      Object.assign(new state.Token('h1_chip', '', 0), {}),
      Object.assign(new state.Token('text', '', 0), { content: m[1].padStart(2, '0') }),
      Object.assign(new state.Token('h1_chip_close', '', 0), {}),
    ]
    if (rest) {
      first.content = rest
      inline.children = [...chip, first, ...inline.children.slice(1)]
    } else {
      inline.children = [...chip, ...inline.children.slice(1)]
    }
  }
})

// ---------- core rule: 文末识别 → 最后一个 hr 之后、以 —— 开头的段落组标记 footer（居中）；无 hr 时回退到最后一个引用块外的 —— 段落 ----------
md.core.ruler.push('footer_center', (state) => {
  const tokens = state.tokens
  const startsWithDash = (i) => {
    const inline = tokens[i + 1]
    return !!inline && inline.type === 'inline' && inline.content.replace(/^\*+/, '').trim().startsWith('——')
  }
  let lastHr = -1
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type === 'hr') { lastHr = i; break }
  }
  let first = -1
  if (lastHr !== -1) {
    for (let i = lastHr + 1; i < tokens.length; i++) {
      if (tokens[i].type === 'paragraph_open') { first = i; break }
    }
    if (first === -1 || !startsWithDash(first)) return
  } else {
    let quoteDepth = 0
    for (let i = 0; i < tokens.length; i++) {
      const ty = tokens[i].type
      if (ty === 'blockquote_open') quoteDepth++
      else if (ty === 'blockquote_close') quoteDepth--
      else if (ty === 'paragraph_open' && quoteDepth === 0 && startsWithDash(i)) first = i
    }
    if (first === -1) return
  }
  for (let i = first; i < tokens.length; i++) {
    if (tokens[i].type === 'paragraph_open') tokens[i].meta = { footer: true }
  }
})

// ---------- 工具 ----------
const top = (env) => env.contextStack[env.contextStack.length - 1] || 'root'
const inQuote = (env) => env.contextStack.includes('blockquote')
const inList = (env) => env.contextStack.includes('li')
const listDepth = (env) => env.contextStack.filter((c) => c === 'li').length
const th = (env) => (env && env.theme) || defaultTheme

// 段落是否为引用块内最后一段（决定 margin）
const lastParaInQuote = (tokens, idx) => {
  for (let j = idx + 1; j < tokens.length; j++) {
    const ty = tokens[j].type
    if (ty === 'paragraph_open') return false
    if (ty === 'blockquote_close') return true
    if (ty === 'blockquote_open') return false
  }
  return true
}

// ---------- renderer rules ----------
const rules = md.renderer.rules

rules.h1_chip = (tokens, idx, opts, env) => `<span style="${th(env).h1Chip}">`
rules.h1_chip_close = () => '</span>'

rules.heading_open = (tokens, idx, opts, env) => {
  const t = th(env)
  const tag = tokens[idx].tag
  const style = { h1: t.h1, h2: t.h2, h3: t.h3, h4: t.h4 }[tag] || t.h4
  const marker = tag === 'h3' ? `<span style="${t.listMarker}">▪</span>&nbsp;` : ''
  return `<${tag} style="${style}">${marker}`
}
rules.heading_close = (tokens, idx) => `</${tokens[idx].tag}>`

rules.strong_open = (tokens, idx, opts, env) => {
  if (top(env) === 'footer') return '<strong>'
  return `<strong style="color:${th(env).colors.primary};">`
}
rules.strong_close = () => '</strong>'
rules.em_open = () => '<em>'
rules.em_close = () => '</em>'

rules.blockquote_open = (tokens, idx, opts, env) => {
  env.contextStack.push('blockquote')
  env.quoteDepth += 1
  const t = th(env)
  return `<section style="${t.blockquote.box}">`
}
rules.blockquote_close = (tokens, idx, opts, env) => {
  env.contextStack.pop()
  env.quoteDepth -= 1
  return '</section>'
}

rules.bullet_list_open = (tokens, idx, opts, env) => {
  env.contextStack.push('ul')
  return ''
}
rules.bullet_list_close = (tokens, idx, opts, env) => {
  env.contextStack.pop()
  return ''
}
rules.ordered_list_open = (tokens, idx) => {
  return ''
}
rules.ordered_list_close = () => ''
rules.list_item_open = (tokens, idx, opts, env) => {
  env.contextStack.push('li')
  const indent = '\u00a0\u00a0\u00a0'.repeat(Math.max(0, listDepth(env) - 1))
  if (env.inOrderedList) {
    env.listCounters[env.listCounters.length - 1] += 1
    const n = env.listCounters[env.listCounters.length - 1]
    env.pendingMarker = `${indent}<span style="${th(env).listMarker}">${n}.</span>&nbsp;`
  } else {
    env.pendingMarker = `${indent}<span style="${th(env).listMarker}">•</span>&nbsp;&nbsp;`
  }
  return ''
}
rules.list_item_close = (tokens, idx, opts, env) => {
  env.contextStack.pop()
  return ''
}

// 有序列表计数器：借助默认的 ordered list token 处理
const origOrderedListOpen = rules.ordered_list_open
rules.ordered_list_open = (tokens, idx, opts, env) => {
  env.inOrderedList = true
  env.listCounters.push(0)
  return origOrderedListOpen(tokens, idx, opts, env)
}
const origOrderedListClose = rules.ordered_list_close
rules.ordered_list_close = (tokens, idx, opts, env) => {
  env.listCounters.pop()
  env.inOrderedList = env.listCounters.length > 0
  return origOrderedListClose(tokens, idx, opts, env)
}

rules.code_inline = (tokens, idx, opts, env) =>
  `<span style="${th(env).inlineCode}">${esc(tokens[idx].content)}</span>`

rules.link_open = (tokens, idx, opts, env) =>
  `<span style="color:${th(env).colors.primary};font-weight:bold;word-break:break-all;">`
rules.link_close = () => '</span>'

rules.softbreak = () => '<br>'
rules.hardbreak = () => '<br>'
rules.hr = (tokens, idx, opts, env) => `<hr style="${th(env).hr}">`

rules.fence = (tokens, idx, opts, env) => {
  const t = th(env)
  const token = tokens[idx]
  const lang = (token.info || '').trim().split(/\s+/)[0] || ''

  const lines = highlightToLines(token.content.replace(/\n$/, ''), lang, t.code.tokens)

  // 首行整行注释 → 主题强调标题行
  const commentColor = t.code.tokens['hljs-comment'].match(/color:(#[0-9a-fA-F]+)/)[1]
  const body = lines
    .map((l, i) => {
      const style = i === 0 && l.includes(`color:${commentColor}`)
        ? t.code.titleLine
        : t.code.line
      return `<p style="${style}">${l}</p>`
    })
    .join('')

  return `<section style="${t.code.scroll}"><table style="${t.code.table}"><tbody><tr><td style="${t.code.block}">${body}</td></tr></tbody></table></section>`
}
rules.code_block = rules.fence

rules.table_open = (tokens, idx, opts, env) => `<table style="${th(env).table}">`
rules.table_close = () => '</table>'
rules.thead_open = () => '<thead>'
rules.thead_close = () => '</thead>'
rules.tbody_open = (tokens, idx, opts, env) => {
  env.inTbody = true
  env.tbodyRow = -1
  return '<tbody>'
}
rules.tbody_close = (tokens, idx, opts, env) => {
  env.inTbody = false
  return '</tbody>'
}
rules.tr_open = (tokens, idx, opts, env) => {
  if (env.inTbody) env.tbodyRow += 1
  return '<tr>'
}
rules.tr_close = () => '</tr>'
rules.th_open = (tokens, idx, opts, env) => `<th style="${th(env).tableTh}">`
rules.th_close = () => '</th>'
rules.td_open = (tokens, idx, opts, env) => {
  const t = th(env)
  const zebra = env.inTbody && env.tbodyRow % 2 === 1 ? `background:${t.colors.quoteBg};` : ''
  return `<td style="${zebra}${t.tableTd}">`
}
rules.td_close = () => '</td>'

rules.image = (tokens, idx, opts, env) => {
  const t = th(env)
  const token = tokens[idx]
  const alt = token.children ? token.children.map((c) => c.content || '').join('') : ''
  const resolved = env.resolveImage ? env.resolveImage(token.attrGet('src') || '') : { src: token.attrGet('src'), matched: true }
  if (!resolved.matched && env.warnings) env.warnings.push(alt || token.attrGet('src'))

  env.figureCount += 1
  const captionText = /^图\s*\d+\s*[·•]/.test(alt) ? alt : `图 ${env.figureCount} · ${alt || basenameOf(resolved.src)}`
  const imgStyle = resolved.matched ? t.image.img : t.image.imgMissing

  return (
    `<p style="${t.image.figure}"><img src="${esc(resolved.src)}" alt="${esc(alt)}" style="${imgStyle}"></p>` +
    `<p style="${t.image.caption}">${esc(captionText)}</p>`
  )
}

function basenameOf(src) {
  const clean = String(src).split(/[?#]/)[0].replace(/\\/g, '/')
  const segs = clean.split('/')
  return segs[segs.length - 1] || '图片'
}

// 段落开标签：上下文样式 + 图片独占段跳过包裹 + 列表标记注入 + 引用签名样式
rules.paragraph_open = (tokens, idx, opts, env) => {
  const inlineTok = tokens[idx + 1]
  if (
    inlineTok &&
    inlineTok.type === 'inline' &&
    inlineTok.children &&
    inlineTok.children.length === 1 &&
    inlineTok.children[0].type === 'image'
  ) {
    env.skipPara = true
    return ''
  }
  env.skipPara = false

  const t = th(env)
  let style
  if (tokens[idx].meta && tokens[idx].meta.footer) {
    const isLead = inlineTok && inlineTok.content.replace(/^\*+/, '').trim().startsWith('——')
    style = isLead ? t.footerLead : t.footerText
    env.contextStack.push('footer')
  } else if (inQuote(env)) {
    const isSignature = inlineTok && inlineTok.content.trim().startsWith('——')
    if (isSignature) style = t.blockquote.signature
    else style = lastParaInQuote(tokens, idx) ? t.blockquote.text : t.blockquote.textGap
  } else if (inList(env)) {
    style = t.listItem
  } else {
    style = t.paragraph
  }

  let marker = ''
  if (env.pendingMarker && inList(env)) {
    marker = env.pendingMarker
    env.pendingMarker = null
  }
  return `<p style="${style}">${marker}`
}
rules.paragraph_close = (tokens, idx, opts, env) => {
  if (env.skipPara) {
    env.skipPara = false
    return ''
  }
  if (top(env) === 'footer') env.contextStack.pop()
  return '</p>'
}

// ---------- 对外接口 ----------
export function render(src, env = {}) {
  env.theme = env.theme || defaultTheme
  env.contextStack = []
  env.quoteDepth = 0
  env.inOrderedList = false
  env.listCounters = []
  env.pendingMarker = null
  env.figureCount = 0
  env.warnings = env.warnings || []
  env.skipPara = false
  env.inTbody = false
  env.tbodyRow = -1
  const body = md.render(src, env)
  return `<section style="${env.theme.container}">${body}</section>`
}
