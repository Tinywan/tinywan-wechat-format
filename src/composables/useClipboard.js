function fallbackCopyRich(container) {
  const div = document.createElement('div')
  div.contentEditable = true
  div.style.position = 'fixed'
  div.style.left = '-9999px'
  div.style.top = '0'
  div.innerHTML = container.innerHTML
  document.body.appendChild(div)
  const range = document.createRange()
  range.selectNodeContents(div)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  sel.removeAllRanges()
  document.body.removeChild(div)
  return ok
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  ta.style.top = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

export async function copyRichText(container) {
  const htmlStr = container.innerHTML
  const plain = container.innerText || ''
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlStr], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        }),
      ])
      return { ok: true, fallback: false }
    } catch {
      /* fall through to execCommand */
    }
  }
  const ok = fallbackCopyRich(container)
  return { ok, fallback: true }
}

export async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      /* fall through */
    }
  }
  return fallbackCopyText(text)
}

export function downloadHtml(sectionHtml, filename = 'article.html') {
  const doc = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<title>${filename.replace(/\.html$/, '')}</title>\n</head>\n<body style="margin:0;padding:0;">\n${sectionHtml}\n</body>\n</html>`
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
