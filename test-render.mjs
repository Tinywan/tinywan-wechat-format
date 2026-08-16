import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><body></body>')
globalThis.DOMParser = dom.window.DOMParser
globalThis.Node = dom.window.Node

const { render } = await import('./src/core/render.js')
const { themes, getTheme } = await import('./src/core/themes.js')

const md = fs.readFileSync(path.resolve('src/assets/sample.md'), 'utf-8')
const env = { warnings: [] }
const html = render(md, env)

fs.writeFileSync('test-output.html', html, 'utf-8')

const checks = [
  ['容器 677px', html.includes('max-width:677px')],
  ['h1 样式', html.includes('font-size:22px;font-weight:bold;text-align:center;color:#1f5fa6;line-height:2')],
  ['h2 渐变色块', html.includes('background:linear-gradient(135deg,#2273b8,#3a8ee6)')],
  ['色块序号 01', html.includes('<span style="display:inline-block;padding:0 10px;border-radius:6px') && html.includes('>01</span>')],
  ['h3 竖线', html.includes('border-left:4px solid #2273b8;padding-left:10px')],
  ['提示框底色', html.includes('background:#eaf2fa')],
  ['签名样式', html.includes('font-size:13px;line-height:1.8;color:#8a94a0')],
  ['代码块深底', html.includes('background:#2a2f3a')],
  ['代码窗口圆点', html.includes('background:#ff5f57')],
  ['代码语言标签', html.includes('PHP')],
  ['行内代码', html.includes('background:#e8edf2;color:#4a7fa5')],
  ['列表渐变圆点', html.includes('border-radius:50%;background:#2273b8;background:linear-gradient(135deg,#2273b8,#3a8ee6)')],
  ['列表悬挂缩进', html.includes('padding-left:16px;text-indent:-16px')],
  ['图注格式', html.includes('图 1 ·')],
  ['无 ul/ol 标签', !/<\/?(ul|ol)[\s>]/.test(html)],
  ['无 class 属性', !/class=/.test(html)],
  ['无 style 块', !/<style/.test(html)],
  ['关键字高亮紫', html.includes('color:#c678dd')],
  ['字符串高亮橙', html.includes('color:#d19a66')],
  ['注释高亮灰', html.includes('color:#7f848e')],
  ['字体栈', html.includes("'HarmonyOS Sans','PingFang SC','MiSans','Source Han Sans SC','Microsoft YaHei',-apple-system,sans-serif")],
]

// ---------- 多主题 ----------
const orangeHtml = render(md, { theme: getTheme('orange-heart') })
const nightHtml = render(md, { theme: getTheme('night') })
checks.push(
  ['橙心主题主色', orangeHtml.includes('#ff3502') && orangeHtml.includes('background:#fff2ec')],
  ['橙心主题渐变', orangeHtml.includes('linear-gradient(135deg,#ff3502,#ff8052)')],
  ['凝夜主题引用块', nightHtml.includes('background:#232733') && nightHtml.includes('color:#cfd4e3')],
)
for (const t of themes) {
  const out = render(md, { theme: t.theme })
  checks.push([
    `主题「${t.name}」合规`,
    out.length > 1000 && !/class=/.test(out) && !/<style/.test(out) && !/<\/?(ul|ol)[\s>]/.test(out),
  ])
}

// ---------- 表格 ----------
const tableHtml = render('| 通知 | 触发时机 |\n|---|---|\n| Launch | 调度器启动时 |\n| Suspend | 挂起前 |\n')
checks.push(
  ['表格表头主题底色', tableHtml.includes('<th style="background:#2273b8;color:#ffffff')],
  ['表格单元格边框', tableHtml.includes('border:1px solid #d5e2ef')],
  ['表格字体栈', tableHtml.includes('border-collapse:collapse;width:100%')],
)

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failed++
}
console.log(`\n图片缺失警告: ${env.warnings.length} 项 →`, env.warnings)
console.log(failed === 0 ? '\n全部通过 ✓' : `\n${failed} 项失败 ✗`)
process.exit(failed ? 1 : 0)
