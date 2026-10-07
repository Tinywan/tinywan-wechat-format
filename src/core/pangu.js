/**
 * 中英文之间自动加空格（pangu spacing）
 * 参考 https://github.com/vinta/pangu.js，精简为纯文本处理。
 * 仅处理正文文本，不改动 Markdown 语法标记（代码块、链接 URL 等）。
 */

// CJK 统一表意文字 + 扩展 A/B + 兼容表意 + 部首 + 笔画 + 注音 + 日文假名 + 韩文
const CJK =
  '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f' +
  '\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f'

const RE_CJK_L = new RegExp(`([${CJK}])([A-Za-z0-9\\$%#@&])`, 'g')
const RE_L_CJK = new RegExp(`([A-Za-z0-9%#@&!?])([${CJK}])`, 'g')

/**
 * 对 Markdown 纯文本做 pangu 空格处理。
 * - 跳过代码块（``` ... ```）
 * - 跳过行内代码（`...`）
 * - 跳过链接 URL 部分（[text](url)）
 * - 跳过图片 URL 部分（![alt](url)）
 */
export function spacingMarkdown(text) {
  // 切分：保护代码块 / 行内代码 / 链接&图片 URL 不被处理
  const PROTECTED = /(`{3,}[\s\S]*?`{3,})|(`[^`\n]+?`)|(!?\[[^\]]*\]\([^)]*\))/g

  const parts = []
  let last = 0

  for (const m of text.matchAll(PROTECTED)) {
    if (m.index > last) {
      parts.push({ text: text.slice(last, m.index), process: true })
    }
    parts.push({ text: m[0], process: false })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last), process: true })
  }

  return parts
    .map((p) => (p.process ? panguText(p.text) : p.text))
    .join('')
}

function panguText(s) {
  return s.replace(RE_CJK_L, '$1 $2').replace(RE_L_CJK, '$1 $2')
}
