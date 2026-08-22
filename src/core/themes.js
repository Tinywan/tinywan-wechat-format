export const FONT = `Optima,PingFangSC-regular,serif`
export const MONO = `Consolas,Menlo,monospace`

// ---------- 语法高亮色板 ----------
// One Dark（深色代码块）
const oneDark = {
  comment: '#7f848e', string: '#d19a66', keyword: '#c678dd',
  title: '#61afef', klass: '#e5c07b', variable: '#e06c75', green: '#98c379',
}
// GitHub Light（浅色代码块）
const githubLight = {
  comment: '#6a737d', string: '#032f62', keyword: '#d73a49',
  title: '#6f42c1', klass: '#e36209', variable: '#005cc5', green: '#22863a',
}

const tokenMap = (t) => ({
  'hljs-comment': `color:${t.comment};`,
  'hljs-quote': `color:${t.comment};`,
  'hljs-string': `color:${t.string};`,
  'hljs-regexp': `color:${t.string};`,
  'hljs-number': `color:${t.string};`,
  'hljs-keyword': `color:${t.keyword};`,
  'hljs-selector-tag': `color:${t.keyword};`,
  'hljs-literal': `color:${t.keyword};`,
  'hljs-doctag': `color:${t.keyword};`,
  'hljs-meta': `color:${t.keyword};`,
  'hljs-title': `color:${t.title};`,
  'hljs-title.class_': `color:${t.klass};`,
  'hljs-title.function_': `color:${t.title};`,
  'hljs-function': `color:${t.title};`,
  'hljs-section': `color:${t.title};font-weight:bold;`,
  'hljs-name': `color:${t.variable};`,
  'hljs-attr': `color:${t.string};`,
  'hljs-attribute': `color:${t.string};`,
  'hljs-built_in': `color:${t.klass};`,
  'hljs-type': `color:${t.klass};`,
  'hljs-params': `color:${t.string};`,
  'hljs-variable': `color:${t.variable};`,
  'hljs-variable.language_': `color:${t.variable};`,
  'hljs-tag': `color:${t.variable};`,
  'hljs-symbol': `color:${t.green};`,
  'hljs-bullet': `color:${t.green};`,
  'hljs-addition': `color:${t.green};`,
  'hljs-deletion': `color:${t.variable};`,
  'hljs-selector-class': `color:${t.string};`,
  'hljs-selector-id': `color:${t.title};`,
  'hljs-link': `color:${t.string};`,
  'hljs-emphasis': 'font-style:italic;',
  'hljs-strong': 'font-weight:bold;',
})

// ---------- 主题工厂 ----------
// palette: { primary, deep, light, accent, quoteBg,
//            codeBg, codeText, codeLabel, codeTitleColor,
//            inlineCodeBg, inlineCodeText, syntax }
export function buildTheme(p) {
  const c = {
    primary: p.primary, deep: p.deep, light: p.light,
    text: p.text || '#333', gray: p.gray || '#8a94a0', accent: p.accent,
    quoteBg: p.quoteBg, codeBg: p.codeBg, codeText: p.codeText,
    inlineCodeBg: p.inlineCodeBg, inlineCodeText: p.inlineCodeText,
    quoteText: p.quoteText || p.text || '#333',
    quoteGray: p.quoteGray || p.gray || '#8a94a0',
  }
  return {
    name: p.name,
    colors: c,

    container: `max-width:677px;margin:0 auto;padding:0 16px;`,

    h1: `font-size:18px;font-weight:bold;text-align:center;color:${c.deep};line-height:1.4;margin:40px 0 24px 0;font-family:${FONT};`,

    h2: `font-size:17px;font-weight:bold;text-align:left;color:${c.primary};line-height:1.4;border-left:4px solid ${c.primary};padding-left:10px;margin:48px 0 24px 0;font-family:${FONT};`,

    h1Chip: `display:inline-block;width:26px;height:26px;box-sizing:border-box;line-height:24px;text-align:center;border:1px solid ${c.primary};border-radius:4px;color:${c.primary};font-weight:bold;font-size:14px;margin-right:10px;vertical-align:middle;font-family:${FONT};`,

    h3: `font-size:16px;font-weight:bold;text-align:left;color:${c.deep};line-height:1.4;margin:0 0 16px 0;font-family:${FONT};`,

    h4: `font-size:16px;font-weight:bold;text-align:left;color:${c.deep};line-height:1.4;margin:0 0 14px 0;font-family:${FONT};`,

    paragraph: `font-size:15px;line-height:1.7;letter-spacing:0.3px;color:${c.text};text-align:justify;margin:0 0 24px 0;font-family:${FONT};`,

    listItem: `font-size:15px;line-height:1.6;letter-spacing:0.3px;color:${c.text};text-align:justify;padding-left:16px;text-indent:-16px;margin:0 0 12px 0;font-family:${FONT};`,

    listMarker: `color:${c.primary};font-weight:bold;`,

    blockquote: {
      box: `background:${c.quoteBg};border-left:2px solid ${c.primary};padding:16px 20px;margin:0 0 20px 0;`,
      text: `font-size:15px;line-height:1.7;letter-spacing:0.3px;color:${c.quoteText};margin:0;font-family:${FONT};`,
      textGap: `font-size:15px;line-height:1.7;letter-spacing:0.3px;color:${c.quoteText};margin:0 0 8px 0;font-family:${FONT};`,
      signature: `font-size:13px;line-height:1.8;color:${c.quoteGray};margin:0;font-family:${FONT};`,
    },

    image: {
      figure: `text-align:center;margin:0;font-size:0;line-height:0;`,
      img: `max-width:100%;display:block;margin:0 auto;border-radius:6px;`,
      imgMissing: `max-width:100%;display:block;margin:0 auto;border-radius:6px;outline:2px dashed #e06c75;outline-offset:4px;`,
      caption: `font-size:13px;line-height:1.6;color:${c.gray};text-align:center;margin:4px 0 24px 0;font-family:${FONT};`,
    },

    inlineCode: `background:${c.inlineCodeBg};color:${c.inlineCodeText};border-radius:3px;padding:1px 6px;font-size:15px;font-family:${MONO};word-break:break-all;`,

    table: `border-collapse:collapse;width:100%;margin:0 0 20px 0;font-family:${FONT};`,

    tableTh: `background:${c.primary};color:#ffffff;font-size:15px;font-weight:bold;line-height:1.6;letter-spacing:0.3px;padding:8px 12px;border:1px solid ${c.primary};text-align:left;font-family:${FONT};`,

    tableTd: `font-size:15px;line-height:1.6;color:${c.text};padding:8px 12px;border:1px solid ${p.tableBorder};text-align:left;vertical-align:top;font-family:${FONT};`,

    code: {
      scroll: `overflow-x:auto;margin:0 0 20px 0;`,
      table: `border-collapse:collapse;width:100%;margin:0;`,
      block: `background:${c.codeBg};border-radius:4px;padding:20px 16px;white-space:nowrap;`,
      line: `font-size:15px;line-height:1.7;color:${c.codeText};font-family:${MONO};white-space:nowrap;margin:0;`,
      titleLine: `font-size:15px;line-height:1.7;color:${p.codeTitleColor};font-weight:bold;font-family:${MONO};white-space:nowrap;margin:0;`,
      tokens: tokenMap(p.syntax),
    },

    hr: `border:none;border-top:1px dashed ${c.gray};width:100%;margin:40px 0;`,

    footerLead: `font-size:15px;line-height:1.8;color:${c.primary};text-align:center;margin:30px 0 8px 0;font-family:${FONT};`,

    footerText: `font-size:15px;line-height:2;color:${c.text};text-align:center;margin:0 0 8px 0;font-family:${FONT};`,
  }
}

// ---------- 主题色板 ----------
export const themes = [
  {
    id: 'blue-tech', name: '蓝色科技',
    primary: '#2273b8', deep: '#1f5fa6', light: '#3a8ee6', accent: '#e8833a',
    quoteBg: '#f0f6fb',
    codeBg: '#2a2f3a', codeText: '#aeb6c2', codeLabel: '#7f848e', codeTitleColor: '#c678dd',
    inlineCodeBg: '#e8edf2', inlineCodeText: '#4a7fa5', tableBorder: '#d5e2ef',
    syntax: oneDark,
  },
  {
    id: 'orange-heart', name: '橙心',
    primary: '#ff3502', deep: '#e6461f', light: '#ff8052', accent: '#1e80ff',
    quoteBg: '#fdf3ee',
    codeBg: '#2d2a26', codeText: '#c8c2bb', codeLabel: '#8a8178', codeTitleColor: '#c678dd',
    inlineCodeBg: '#ffece3', inlineCodeText: '#d4380d', tableBorder: '#ffd9cc',
    syntax: oneDark,
  },
  {
    id: 'violet', name: '姹紫',
    primary: '#5d3587', deep: '#4a2a6b', light: '#8e5fc0', accent: '#e8833a',
    quoteBg: '#f7f2fb',
    codeBg: '#2b2436', codeText: '#b9aecb', codeLabel: '#857a96', codeTitleColor: '#c678dd',
    inlineCodeBg: '#efe6f7', inlineCodeText: '#6b3fa0', tableBorder: '#e2d5f0',
    syntax: oneDark,
  },
  {
    id: 'green', name: '绿意',
    primary: '#0e8c64', deep: '#0a6b4c', light: '#3fb88f', accent: '#e8833a',
    quoteBg: '#f0f9f5',
    codeBg: '#f6f8fa', codeText: '#24292e', codeLabel: '#6a737d', codeTitleColor: '#d73a49',
    inlineCodeBg: '#e6f4ef', inlineCodeText: '#0e8c64', tableBorder: '#cfe8df',
    syntax: githubLight,
  },
  {
    id: 'night', name: '凝夜',
    primary: '#b39ddb', deep: '#5e35b1', light: '#7e57c2', accent: '#ffb74d',
    quoteBg: '#232733', quoteText: '#cfd4e3', quoteGray: '#8b93a7',
    codeBg: '#14161c', codeText: '#aab2c0', codeLabel: '#6b7280', codeTitleColor: '#c678dd',
    inlineCodeBg: '#2b3040', inlineCodeText: '#b39ddb', tableBorder: '#3a4152',
    syntax: oneDark,
  },
  {
    id: 'kami-paper', name: '暖纸',
    primary: '#1B365D', deep: '#16283f', light: '#3d5a80', accent: '#b08d57',
    text: '#3d3b36', gray: '#8a867d',
    quoteBg: '#f0eee4', quoteText: '#5c5a52',
    codeBg: '#faf9f4', codeText: '#3d3b36', codeLabel: '#8a867d', codeTitleColor: '#1B365D',
    inlineCodeBg: '#efece1', inlineCodeText: '#1B365D',
    tableBorder: '#e3e0d3', syntax: githubLight,
  },
  {
    id: 'kimi-blue', name: 'Kimi 蓝',
    primary: '#007CFF', deep: '#002F5B', light: '#00A1FF', accent: '#DFC8F5',
    text: '#2b2f33', gray: '#707070',
    quoteBg: '#f2f8ff', quoteText: '#3a4750',
    codeBg: '#0f2740', codeText: '#c9d6e3', codeLabel: '#7a93ab', codeTitleColor: '#A0DAF7',
    inlineCodeBg: '#e8f3ff', inlineCodeText: '#007CFF',
    tableBorder: '#E1E3E6', syntax: oneDark,
  },
].map((p) => ({ id: p.id, name: p.name, theme: buildTheme(p) }))

export const getTheme = (id) =>
  (themes.find((t) => t.id === id) || themes[0]).theme

export const DEFAULT_THEME_ID = themes[0].id

// 兼容旧导入
export const theme = themes[0].theme
