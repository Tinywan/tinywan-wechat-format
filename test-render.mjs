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

const h4Html = render('#### 次级小节\n', { warnings: [] })
const codeNoNumHtml = render('```js\nconsole.log(1)\n```', { showLineNumbers: false })
const codeWithNumHtml = render('```js\nconsole.log(1)\n```', { showLineNumbers: true })
const dockerHtml = render('```dockerfile\nFROM php:8.4-cli\nRUN apk add --no-cache $PHPIZE_DEPS\n```', { warnings: [] })
const dockerAliasHtml = render('```docker\nFROM php:8.4-cli\n```', { warnings: [] })
const shellHtml = render('```bash\ndocker exec -it dnmp-php84 apk add --no-cache $PHPIZE_DEPS\n```', { warnings: [] })
const spacedListHtml = render('前文\n\n1. 第一项\n2. 第二项\n\n后文', { warnings: [] })

const checks = [
  ['容器 677px', html.includes('max-width:677px')],
  ['容器左右边距 16px（微信编辑器预览必需）', html.includes('padding:0 16px')],
  ['h1 极简居中 18px', html.includes('font-size:18px;font-weight:bold;text-align:center;color:#1f5fa6;line-height:26px')],
  ['h2 居中样式', html.includes('font-size:17px;font-weight:bold;text-align:center;color:#1f5fa6;line-height:25px')],
  ['h2 数字色块', html.includes('border:1px solid #2273b8;border-radius:4px;color:#2273b8;font-weight:bold')],
  ['h2 等宽底横线', html.includes('border-bottom:1px solid #2273b8;padding-bottom:6px;')],
  ['色块序号 01', html.includes('<span style="display:inline-block;width:26px;height:26px;') && html.includes('>01</span>')],
  ['h3 字符竖杆防微信清除且基线对齐', html.includes('<span style="display:inline-block;width:4px;color:#2273b8;font-weight:bold;font-size:16px;line-height:24px;margin-right:8px;vertical-align:0;font-family:Optima,PingFangSC-regular,serif;">▎</span>')],
  ['h4 小方块标记', h4Html.includes('<h4 style="font-size:16px;font-weight:bold;text-align:left;color:#1f5fa6;') && h4Html.includes('>▪</span>&nbsp;次级小节</h4>')],
  ['正文 15px', html.includes('font-size:15px;line-height:26px;letter-spacing:0.3px;color:#333')],
  ['提示框底色', html.includes('background:#f0f6fb')],
  ['引用块 2px 边线', html.includes('background:#f0f6fb;border-left:2px solid #2273b8;padding:16px 20px')],
  ['引用块容器行高 26px', html.includes('border-left:2px solid #2273b8;padding:16px 20px;margin:0 0 20px 0;font-size:15px;line-height:26px;')],
  ['签名样式', html.includes('font-size:13px;line-height:23px;color:#8a94a0')],
  ['代码块浅灰底', html.includes('background:#e9edf1')],
  ['代码 13px', html.includes('font-size:13px;line-height:22px;color:#3f4650;font-family:Consolas')],
  ['语言仅用于高亮不显示标签', !html.includes('>PHP</span>') && !codeNoNumHtml.includes('>JS</span>')],
  ['终端三圆点字符', html.includes('color:#ff5f56;">●</span>') && html.includes('color:#ffbd2e;">●</span>') && html.includes('color:#27c93f;">●</span>')],
  ['终端圆点调整为 16px', html.includes('display:inline-block;font-size:16px;line-height:20px;font-weight:normal;letter-spacing:0;margin-right:8px;')],
  ['macOS 圆点顶栏独立底色', html.includes('<td style="background:#dde2e7;color:#8a919c;border:none;border-bottom:1px solid #d2d8df;padding:8px 16px;font-size:12px;line-height:20px;font-weight:normal;letter-spacing:0;text-align:left;font-family:Consolas,Menlo,monospace;">') && !html.includes('float:right')],
  ['顶栏细分隔线', html.includes('border-bottom:1px solid #d2d8df')],
  ['代码块序号默认关闭', !html.includes('user-select:none')],
  ['代码块序号支持开启', codeWithNumHtml.includes('color:#8a919c;font-family:Consolas,Menlo,monospace;font-size:12px;line-height:22px;user-select:none;width:20px;">1</span>') && codeWithNumHtml.includes('console')],
  ['PHP代码标签转义显示', html.includes('&lt;?php')],
  ['代码块横滑窗口', html.includes('overflow-x:auto')],
  ['代码块表格无外框', html.includes('<table style="border-collapse:separate;border-spacing:0;width:100%;margin:0;font-size:13px;line-height:22px;background:#e9edf1;border:none;border-radius:6px;overflow:hidden;">')],
  ['代码单元格清除微信默认边框', html.includes('background:#e9edf1;border:none;padding:12px 16px 16px')],
  ['代码块左右内边距 16px', html.includes('padding:12px 16px 16px;text-align:left;white-space:nowrap;')],
  ['代码行显式左对齐防微信两端对齐', html.includes('font-family:Consolas,Menlo,monospace;text-align:left;white-space:nowrap;') && html.includes('padding:12px 16px 16px;text-align:left;white-space:nowrap;')],
  ['微信代码行使用块级 span 且不折行', html.includes('<span style="display:block;font-size:13px;line-height:22px;color:#3f4650;') && html.includes('white-space:nowrap;word-break:normal;word-wrap:normal;overflow-wrap:normal') && !html.includes('white-space:pre-wrap')],
  ['代码空格硬化且不插入折行点', html.includes('\u00a0') && !html.includes('<wbr>')],
  ['行内代码', html.includes('background:#f3f6f8;color:#4a7fa5') && html.includes('padding:1px 6px;font-size:15px;font-family:Consolas')],
  ['链接断行', linkHtml.includes('font-weight:bold;word-break:break-all')],
  ['链接附原始地址', linkHtml.includes('（https://example.com/long/path）')],
  ['链接地址灰色小字', linkHtml.includes('font-size:12px;line-height:22px;color:#8a94a0;word-break:break-all;')],
  ['裸链接不重复附地址', !render('[https://example.com](https://example.com)', { warnings: [] }).includes('（https://example.com）')],
  ['文末居中（无 hr）', footerNoHr.includes('line-height:27px;color:#2273b8;text-align:center')],
  ['列表方块标记', html.includes('>■<')],
  ['方块主色 8px 定宽居中', html.includes('<span style="display:inline-block;width:10px;text-align:center;color:#2273b8;font-weight:bold;font-size:8px;vertical-align:2px;">■</span>')],
  ['有序数字定宽右对齐', html.includes('<span style="display:inline-block;width:10px;text-align:right;color:#2273b8;font-weight:bold;">1.</span>')],
  ['列表左对齐且整体缩进 8px', html.includes('text-align:left;padding-left:14px;text-indent:-14px;margin:0 0 8px 8px;')],
  ['列表前间距 16px', spacedListHtml.includes('margin:0 0 16px 0;font-family:Optima')],
  ['列表项间距保持 8px', spacedListHtml.includes('margin:0 0 8px 8px;font-family:Optima')],
  ['列表后间距 16px', spacedListHtml.includes('margin:0 0 16px 8px;font-family:Optima')],
  ['有序两位数同宽不错位', render(Array.from({ length: 12 }, (_, i) => `${i + 1}. 第${i + 1}项`).join('\n'), { warnings: [] }).includes('width:10px;text-align:right;color:#2273b8;font-weight:bold;">10.</span>')],
  ['列表行高 22px', html.includes('font-size:15px;line-height:22px;letter-spacing:0.3px')],
  ['全文无 border-radius:50%', !html.includes('border-radius:50%')],
  ['列表悬挂缩进', html.includes('padding-left:14px;text-indent:-14px')],
  ['图注格式', imgHtml.includes('图 1 · 架构图')],
  ['strong 主色无下划线', html.includes('<strong style="color:#2273b8;">') && !html.includes('border-bottom:1px dashed')],
  ['图片圆角', imgHtml.includes('border-radius:6px')],
  ['无 ul/ol 标签', !/<\/?(ul|ol)[\s>]/.test(html)],
  ['无 class 属性', !/class=/.test(html)],
  ['无 style 块', !/<style/.test(html)],
  ['关键字使用中性深灰', html.includes('color:#3f4650')],
  ['字符串使用低饱和金色', html.includes('color:#9a6a16')],
  ['注释高亮灰', html.includes('color:#8a919c')],
  ['Dockerfile 语言与变量高亮', dockerHtml.includes('<span style="color:#3f4650;">FROM</span>') && dockerHtml.includes('<span style="color:#9a6a16;">$PHPIZE_DEPS</span>')],
  ['docker 别名高亮', dockerAliasHtml.includes('<span style="color:#3f4650;">FROM</span>')],
  ['Shell 内置命令深灰加粗', shellHtml.includes('<span style="color:#3f4650;font-weight:bold;">exec</span>') && shellHtml.includes('<span style="color:#9a6a16;">$PHPIZE_DEPS</span>')],
  ['字体栈', html.includes("Optima,PingFangSC-regular,serif")],
]

// ---------- 多主题 ----------
const orangeHtml = render(md, { theme: getTheme('orange-heart') })
const nightHtml = render(md, { theme: getTheme('night') })
checks.push(
  ['橙心主题主色', orangeHtml.includes('#ff3502') && orangeHtml.includes('background:#fdf3ee')],
  ['橙心主题描边', orangeHtml.includes('border:1px solid #ff3502;border-radius:4px;color:#ff3502')],
  ['凝夜主题引用块', nightHtml.includes('background:#232733') && nightHtml.includes('color:#cfd4e3')],
  ['凝夜主题斑马纹浅底', render('| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n', { theme: getTheme('night') }).includes('background:#efeaf7;font-size:14px;line-height:22px;color:#333')],
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
  ['表格表头自适应换行', tableHtml.includes('text-align:left;word-break:break-word;font-family:')],
  ['表格单元格边框', tableHtml.includes('border:1px solid #d5e2ef')],
  ['表格斑马纹', tableHtml.includes('background:#f0f6fb;font-size:14px;line-height:22px')],
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
