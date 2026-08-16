export const FONT = `'HarmonyOS Sans','PingFang SC','MiSans','Source Han Sans SC','Microsoft YaHei',-apple-system,sans-serif`
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

    container: `max-width:677px;margin:0 auto;padding:0 8px;`,

    h1: `font-size:22px;font-weight:bold;text-align:center;color:${c.deep};line-height:2;margin:28px 0 24px 0;font-family:${FONT};`,

    h2: `font-size:20px;font-weight:bold;text-align:center;color:${c.deep};line-height:1.8;margin:40px 0 22px 0;font-family:${FONT};`,

    h2Chip: `display:inline-block;padding:0 10px;border-radius:6px;background:${c.primary};background:linear-gradient(135deg,${c.primary},${c.light});color:#ffffff;font-size:16px;line-height:1.7;margin-right:10px;vertical-align:middle;font-family:${FONT};`,

    h3: `font-size:17px;font-weight:bold;text-align:left;color:${c.primary};line-height:1.6;border-left:4px solid ${c.primary};padding-left:10px;margin:0 0 16px 0;font-family:${FONT};`,

    h4: `font-size:16px;font-weight:bold;text-align:left;color:${c.primary};line-height:1.8;margin:0 0 14px 0;font-family:${FONT};`,

    paragraph: `font-size:16px;line-height:1.8;letter-spacing:1px;color:${c.text};text-align:justify;margin:0 0 20px 0;font-family:${FONT};`,

    listItem: `font-size:16px;line-height:1.8;letter-spacing:1px;color:${c.text};text-align:justify;padding-left:16px;text-indent:-16px;margin:0 0 18px 0;font-family:${FONT};`,

    listMarker: `color:${c.primary};font-weight:bold;`,

    listBullet: `display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.primary};background:linear-gradient(135deg,${c.primary},${c.light});margin-right:8px;vertical-align:2px;`,

    blockquote: {
      box: `background:${c.quoteBg};border-left:4px solid ${c.primary};border-radius:4px;padding:14px 16px;margin:0 0 20px 0;`,
      text: `font-size:15px;line-height:1.9;letter-spacing:1px;color:${c.quoteText};margin:0;font-family:${FONT};`,
      textGap: `font-size:15px;line-height:1.9;letter-spacing:1px;color:${c.quoteText};margin:0 0 8px 0;font-family:${FONT};`,
      strongColor: c.primary,
      signature: `font-size:13px;line-height:1.8;color:${c.quoteGray};margin:0;font-family:${FONT};`,
    },

    image: {
      figure: `text-align:center;margin:0 0 6px 0;font-size:0;line-height:0;`,
      img: `max-width:100%;display:block;margin:0 auto;`,
      imgMissing: `max-width:100%;display:block;margin:0 auto;outline:2px dashed #e06c75;outline-offset:4px;`,
      caption: `font-size:12px;line-height:1.8;color:${c.gray};text-align:center;margin:0 0 20px 0;font-family:${FONT};`,
    },

    inlineCode: `background:${c.inlineCodeBg};color:${c.inlineCodeText};border-radius:3px;padding:1px 6px;font-size:13px;font-family:${MONO};`,

    code: {
      block: `background:${c.codeBg};border-radius:6px;padding:16px 14px;margin:0 0 20px 0;`,
      header: `margin:0 0 12px 0;font-size:0;line-height:0;`,
      dot: `display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;`,
      dots: { red: '#ff5f57', yellow: '#febc2e', green: '#28c840' },
      label: `font-size:11px;line-height:1;color:${p.codeLabel};font-family:${MONO};vertical-align:middle;`,
      line: `font-size:13px;line-height:1.9;color:${c.codeText};font-family:${MONO};margin:0;`,
      titleLine: `font-size:13px;line-height:1.9;color:${p.codeTitleColor};font-weight:bold;font-family:${MONO};margin:0;`,
      tokens: tokenMap(p.syntax),
    },

    hr: `border:none;height:3px;border-radius:2px;background:${c.primary};background:linear-gradient(90deg,${c.primary},${c.light});width:60px;margin:32px auto;`,
  }
}

// ---------- 主题色板 ----------
export const themes = [
  {
    id: 'blue-tech', name: '蓝色科技',
    primary: '#2273b8', deep: '#1f5fa6', light: '#3a8ee6', accent: '#e8833a',
    quoteBg: '#eaf2fa',
    codeBg: '#2a2f3a', codeText: '#aeb6c2', codeLabel: '#7f848e', codeTitleColor: '#c678dd',
    inlineCodeBg: '#e8edf2', inlineCodeText: '#4a7fa5',
    syntax: oneDark,
  },
  {
    id: 'orange-heart', name: '橙心',
    primary: '#ff3502', deep: '#e6461f', light: '#ff8052', accent: '#1e80ff',
    quoteBg: '#fff2ec',
    codeBg: '#2d2a26', codeText: '#c8c2bb', codeLabel: '#8a8178', codeTitleColor: '#c678dd',
    inlineCodeBg: '#ffece3', inlineCodeText: '#d4380d',
    syntax: oneDark,
  },
  {
    id: 'violet', name: '姹紫',
    primary: '#5d3587', deep: '#4a2a6b', light: '#8e5fc0', accent: '#e8833a',
    quoteBg: '#f4eef9',
    codeBg: '#2b2436', codeText: '#b9aecb', codeLabel: '#857a96', codeTitleColor: '#c678dd',
    inlineCodeBg: '#efe6f7', inlineCodeText: '#6b3fa0',
    syntax: oneDark,
  },
  {
    id: 'green', name: '绿意',
    primary: '#0e8c64', deep: '#0a6b4c', light: '#3fb88f', accent: '#e8833a',
    quoteBg: '#eaf7f1',
    codeBg: '#f6f8fa', codeText: '#24292e', codeLabel: '#6a737d', codeTitleColor: '#d73a49',
    inlineCodeBg: '#e6f4ef', inlineCodeText: '#0e8c64',
    syntax: githubLight,
  },
  {
    id: 'night', name: '凝夜',
    primary: '#b39ddb', deep: '#5e35b1', light: '#7e57c2', accent: '#ffb74d',
    quoteBg: '#232733', quoteText: '#cfd4e3', quoteGray: '#8b93a7',
    codeBg: '#14161c', codeText: '#aab2c0', codeLabel: '#6b7280', codeTitleColor: '#c678dd',
    inlineCodeBg: '#2b3040', inlineCodeText: '#b39ddb',
    syntax: oneDark,
  },
].map((p) => ({ id: p.id, name: p.name, theme: buildTheme(p) }))

export const getTheme = (id) =>
  (themes.find((t) => t.id === id) || themes[0]).theme

export const DEFAULT_THEME_ID = themes[0].id

// 兼容旧导入
export const theme = themes[0].theme
