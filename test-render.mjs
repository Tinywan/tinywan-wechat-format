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

const imgHtml = render('![架构图](arch.png)', { warnings: [] })
const linkHtml = render('[文档](https://example.com/long/path)', { warnings: [] })
const footerNoHr = render('**—— 如果这篇对你有帮助 ——**\n\n点赞 · 在看 · 转发', { warnings: [] })

const checks = [
  ['容器 677px', html.includes('max-width:677px')],
  ['h1 样式', html.includes('font-size:20px;font-weight:bold;text-align:center;color:#1f5fa6;line-height:1.4')],
  ['h2 描边色块', html.includes('border:1px solid #2273b8;border-radius:4px;color:#2273b8;font-weight:bold')],
  ['色块序号 01', html.includes('<span style="display:inline-block;width:26px;height:26px;') && html.includes('>01</span>')],
  ['h3 左侧竖条', html.includes('<h3 style="font-size:17px;font-weight:bold;text-align:left;color:#2273b8;line-height:1.4;border-left:2px solid #2273b8;padding-left:10px;')],
  ['提示框底色', html.includes('background:#f0f6fb')],
  ['签名样式', html.includes('font-size:13px;line-height:1.8;color:#8a94a0')],
  ['代码块深底', html.includes('background:#2a2f3a')],
  ['代码块横滑窗口', html.includes('overflow-x:auto')],
  ['代码块单格表格撑宽', html.includes('<table style="border-collapse:collapse;width:100%;margin:0;">')],
  ['代码行不折行', html.includes('white-space:nowrap')],
  ['行内代码', html.includes('background:#e8edf2;color:#4a7fa5')],
  ['链接断行', linkHtml.includes('font-weight:bold;word-break:break-all')],
  ['文末居中（无 hr）', footerNoHr.includes('line-height:1.8;color:#2273b8;text-align:center')],
  ['列表圆点标记', html.includes('>•<')],
  ['全文无 border-radius:50%', !html.includes('border-radius:50%')],
  ['列表悬挂缩进', html.includes('padding-left:16px;text-indent:-16px')],
  ['图注格式', imgHtml.includes('图 1 · 架构图')],
  ['strong 主色无下划线', html.includes('<strong style="color:#2273b8;">') && !html.includes('border-bottom:1px dashed')],
  ['图片圆角', imgHtml.includes('border-radius:6px')],
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
  ['橙心主题主色', orangeHtml.includes('#ff3502') && orangeHtml.includes('background:#fdf3ee')],
  ['橙心主题描边', orangeHtml.includes('border:1px solid #ff3502;border-radius:4px;color:#ff3502')],
  ['凝夜主题引用块', nightHtml.includes('background:#232733') && nightHtml.includes('color:#cfd4e3')],
)
checks.push(
  ['暖纸主题注册', !!getTheme('kami-paper') && getTheme('kami-paper').colors.primary === '#1B365D'],
  ['Kimi 蓝主题注册', !!getTheme('kimi-blue') && getTheme('kimi-blue').colors.primary === '#007CFF'],
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
  ['表格斑马纹', tableHtml.includes('background:#f0f6fb;font-size:15px;line-height:1.6')],
  ['表格字体栈', tableHtml.includes('border-collapse:collapse;width:100%')],
)

// ---------- 文末居中 ----------
const footerHtml = render('---\n\n**—— 如果这篇对你有帮助 ——**\n\n点赞 · 在看 · 转发\n')
checks.push(
  ['文末居中', (footerHtml.match(/text-align:center/g) || []).length >= 2],
  ['文末引导行主题色', footerHtml.includes('color:#2273b8;text-align:center')],
  ['文末加粗裸标签', footerHtml.includes('<strong>——')],
  ['参考资料不居中', !render('---\n\n参考资料：\n\n1. 性能文档\n').includes('text-align:center')],
)

let failed = 0
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failed++
}
console.log(`\n图片缺失警告: ${env.warnings.length} 项 →`, env.warnings)
console.log(failed === 0 ? '\n全部通过 ✓' : `\n${failed} 项失败 ✗`)
process.exit(failed ? 1 : 0)
