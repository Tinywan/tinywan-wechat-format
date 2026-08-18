# 文章排版系统（输出侧）设计规范

> 适用对象：`md-wechat-formatter` 将 Markdown 渲染为微信公众号正文 HTML 的输出样式系统。
> 单一事实来源：`src/core/themes.js`（样式 token 工厂）+ `src/core/render.js`（markdown-it 规则）。
> 默认示例取值均基于默认主题「蓝色科技」（blue-tech）。
> v2 · Kami × Kimi 融合改版（2026-08）：4px 间距网格、行距三档、细线优先；新增「暖纸」「Kimi 蓝」主题。

---

## 1. 设计原则

1. **纯内联样式**：输出不含任何 `class`、`<style>`、外链 CSS —— 微信编辑器会剥离它们。
2. **字体自包含**：每个文字元素自带完整字体栈，不依赖继承（微信会打断继承链）。
3. **渐变必降级**：所有 `linear-gradient` 前先写同位置纯色，旧内核回退到纯色。
4. **结构扁平化**：不使用 `ul/ol/li`（微信粘贴易丢失），列表转为「段落 + 标记」。
5. **主题可插拔**：渲染规则与颜色解耦，调色板 → 工厂 → 全量 token，一键换肤。
6. **克制基线**（Kami × Kimi）：4px 间距网格；行距三档（标题 1.4 / 密排 1.6–1.7 / 阅读 1.75）；细线优先（2px 边线、1px 虚线），装饰收敛，强调色面积严控。

---

## 2. 字体

| Token | 取值 | 用途 |
|---|---|---|
| `FONT` | `'HarmonyOS Sans','PingFang SC','MiSans','Source Han Sans SC','Microsoft YaHei',-apple-system,sans-serif` | 所有正文、标题、表格、图注 |
| `MONO` | `Consolas,Menlo,monospace` | 行内代码、代码块 |

### 字重策略

- 标题、表头、列表标记：`font-weight:bold`（700）；正文：400。
- **不用系统衬线栈**：Kami 标志性的衬线标题依赖 web 字体，微信无法加载，系统衬线（宋体/STSong）在安卓端渲染不可控，放弃。
- **不用 600 中间字重**：Android 微信多数内核仅渲染 400/700 两档，600 会回退或触发合成粗体（违背「严禁合成粗体」初衷），层级靠字号与颜色而非中间字重。

---

## 3. 容器

整篇文章包裹在 `<section>` 中：

```css
max-width: 677px;   /* 微信正文经典阅读宽度 */
margin: 0 auto;
padding: 0 16px;    /* 4px 网格，移动端呼吸感 */
```

---

## 4. 标题

| 级别 | 字号 | 行高 | 颜色 | 对齐 | 其他 |
|---|---|---|---|---|---|
| h1 | 20px | 1.4 | `deep` | 居中 | margin `40px 0 24px` |
| h2 | 19px | 1.4 | `deep` | 居中 | margin `48px 0 24px`，支持数字色块 |
| h3 | 17px | 1.4 | `primary` | 左 | margin `0 0 16px` |
| h4 | 16px | 1.4 | `deep` | 左 | margin `0 0 14px` |

所有标题 `font-weight:bold`。h4 用 `deep` 而非 `primary`：以字重/明度分层，避免强调色堆叠（Kimi 克制）。

### 行距三档

| 档位 | 值 | 应用 |
|---|---|---|
| 标题档 | 1.4 | h1–h4（紧凑，标题不占用过多垂直空间） |
| 密排档 | 1.6–1.7 | 列表 1.7、引用 1.7、代码 1.7、表格 1.6 |
| 阅读档 | 1.75 | 正文段落（16px 移动端中文舒适区，Kami 1.55 按字号比例上调适配） |

### h2 数字色块（chip）

h2 以数字开头（匹配 `^(\d{1,2})[\s、.．·]+`，如 `1、`、`2.`、`3 `）时，数字被抽出为描边色块，单位数补零为两位（`01`、`02`……）：

```css
display:inline-block; padding:0 8px; border:1px solid #2273b8;
border-radius:4px; color:#2273b8; font-weight:bold;
font-size:15px; line-height:1.4;
margin-right:10px; vertical-align:middle;
```

描边芯片呼应全局「细线优先」，与虚线分隔线、2px 引用边线同属一套克制语言；无渐变填充，天然免除降级问题。

实现要点：core rule 在解析期产出中性 token（`h2_chip`/`h2_chip_close`），渲染期才套用 env 主题 —— 解析与配色解耦。

---

## 5. 正文段落

```css
font-size:16px; line-height:1.75; letter-spacing:0.5px;
color:#333; text-align:justify;
margin:0 0 24px 0;
```

- `text-align:justify` 两端对齐，中文排版更整齐；
- `letter-spacing:0.5px` 微字距（由 1px 收紧，去松散感）；
- 段间距 24px（6×4 网格）：行高收紧后以段间留白补偿节奏。

---

## 6. 行内元素

| 元素 | 输出 | 说明 |
|---|---|---|
| `**加粗**` | `<strong>` | 全部带主题色 1px 虚线下划线（`border-bottom:1px dashed ${primary}`，重点划线）；引用块内再叠 `primary` 字色 |
| `*斜体*` | `<em>` | 原样输出 |
| `[链接](url)` | 主题色加粗 `<span>` | 公众号正文外链无效，丢弃 href：`color:${primary};font-weight:bold` |
| 软/硬换行 | `<br>` | — |

### 行内代码

```css
background:#e8edf2; color:#4a7fa5;   /* blue-tech 取值 */
border-radius:3px; padding:1px 6px;
font-size:16px; font-family:Consolas,Menlo,monospace;
```

字号与正文一致（16px）：等宽字体 x 高偏小，同字号下视觉才对齐。

---

## 7. 列表

微信不保留 `ul/ol`，统一输出为 `<p>` + 标记。列表项公共样式：

```css
font-size:16px; line-height:1.7; letter-spacing:0.5px; color:#333;
text-align:justify;
padding-left:16px; text-indent:-16px;   /* 悬挂缩进：折行后文字对齐首行文字 */
margin:0 0 12px 0;                      /* 项间距收紧成组 */
```

### 无序列表：圆点字符

```html
<span style="color:#2273b8;font-weight:bold;">•</span>&nbsp;&nbsp;
```

- 字符为 U+2022 BULLET：PingFang / 雅黑 / HarmonyOS 均内置，零渲染风险；
- 标记 + 两个 `&nbsp;` 宽约 16px，与悬挂缩进一致，折行对齐。

### 有序列表：主题色数字

```html
<span style="color:#2273b8;font-weight:bold;">1.</span>&nbsp;
```

- 计数器由渲染器维护（支持嵌套，各层独立计数）；
- 嵌套层级用 3 个 `\u00a0` × 层深做缩进。

---

## 8. 引用块

输出为 `<section>` 卡片（非 `<blockquote>`），Kami 式细边线：

```css
/* 外框 */
background:#f0f6fb;                     /* quoteBg，各主题统一调浅一档 */
border-left:2px solid #2273b8;          /* Kami 2pt 蓝线，由 4px 收敛 */
border-radius:4px; padding:16px 20px; margin:0 0 20px 0;

/* 装饰引号（框内首行，字符 U+201C） */
font-size:24px; line-height:1; color:#3a8ee6;   /* light 浅主题色 */
margin:0;

/* 段落 */
font-size:15px; line-height:1.7; letter-spacing:0.5px;
color:#333; margin:0;                    /* 末段 */
/* 非末段 margin 改为 0 0 8px，段间留缝 */
```

特殊规则：

| 规则 | 说明 |
|---|---|
| 签名行 | 以 `——` 开头的段落：13px、`gray` 色（`#8a94a0`）、line-height 1.8 |
| 加粗着色 | 引用内 `**加粗**` 着 `primary` 色 |
| 字距 | 引用文字 `letter-spacing:0.5px`，与正文字感一致 |

---

## 9. 图片与图注

```css
/* 图容器 */
text-align:center; margin:0; font-size:0; line-height:0;

/* 图片 */
max-width:100%; display:block; margin:0 auto;
border-radius:6px;                      /* 圆角分级：大图 6px，小元素 4px */

/* 图注 */
font-size:13px; line-height:1.6; color:#8a94a0;
text-align:center; margin:4px 0 24px 0;
```

规则：

1. **base64 内嵌**：图片按文件名匹配用户上传的本地文件，命中则替换为 base64（微信不加载外链图）；
2. **图注自动生成**：`图 N · alt`（alt 已含 `图 N ·` 前缀则不重复编号），N 为全文递增序号；alt 为空时取文件名；
3. **未匹配警示**：未命中的图片加红色虚线外框（`outline:2px dashed #e06c75`）并计入顶部警告条。

---

## 10. 代码块（窗口风格，装饰收敛）

```css
/* 外框 */
background:#2a2f3a;                     /* codeBg */
border-radius:4px; padding:20px 16px; margin:0 0 20px 0;
```

### 头部（fence 带语言/标题时显示）

- 三个 macOS 信号点：`#ff5f57` / `#febc2e` / `#28c840`，**8px** 圆点，间距 8px（由 10px 收敛）；
- 标签：`LANG · 标题`（或仅语言名大写），11px `MONO`，letter-spacing 0.5px，`codeLabel` 色。

示例 fence：` ```php app.php ` → 标签 `PHP · app.php`。

### 代码行

```css
font-size:13px; line-height:1.7; color:#aeb6c2;   /* codeText */
font-family:Consolas,Menlo,monospace;
word-break:break-all;                              /* 长行折行，手机不溢出 */
margin:0;
```

- 空格硬化为 `\u00a0` 保对齐（高亮管线处理）；
- **首行注释标题化**：若首行整行是注释，套用 `titleLine`：加粗、着 `codeTitleColor`（如 `#c678dd`），作为代码块的"标题"。

### 浅色象牙变体（Kami）

浅色代码块不新增 token，复用 `codeBg` + `githubLight` 语法板即可（green、暖纸主题采用）：象牙底 `#faf9f4`、无外边框，契合 Kami「代码块：象牙色背景、4pt 圆角、无外边框」。

### 语法高亮色板

| 语义 | One Dark（深色底） | GitHub Light（浅色底） |
|---|---|---|
| comment / quote | `#7f848e` | `#6a737d` |
| string / number / attr | `#d19a66` | `#032f62` |
| keyword / meta | `#c678dd` | `#d73a49` |
| title / function | `#61afef` | `#6f42c1` |
| class / type / built_in | `#e5c07b` | `#e36209` |
| variable / tag | `#e06c75` | `#005cc5` |
| symbol / bullet / addition | `#98c379` | `#22863a` |

---

## 11. 表格

```css
/* table */
border-collapse:collapse; width:100%;
margin:0 0 20px 0;

/* th */
background:#2273b8; color:#ffffff;
font-size:15px; font-weight:bold; line-height:1.6; letter-spacing:0.5px;
padding:8px 12px; border:1px solid #2273b8; text-align:left;

/* td */
font-size:15px; line-height:1.6; color:#333;
padding:8px 12px; border:1px solid #d5e2ef;   /* tableBorder */
text-align:left; vertical-align:top;

/* 斑马纹：第 2、4… 数据行 td 前置 */
background:#f0f6fb;                     /* quoteBg 浅底色 */
```

15px 密排档与正文 16px 形成层级；padding 走 4px 网格。斑马纹直接写在 td 内联样式上（tr 样式粘贴易丢），表头行不参与。

---

## 12. 分隔线

```css
border:none; border-top:1px dashed #8a94a0;   /* gray，暖灰虚线 */
width:100%; margin:40px 0;
```

Kami 0.5pt 暖灰虚线的微信适配：0.5pt 无 CSS 对应，1px 为最小可靠单位，虚线视觉轻重等效；替代原 3px×60px 渐变短条，去装饰化。

---

## 13. 主题系统

### 工厂模式

`buildTheme(palette)` 接收约 15 个调色板值，展开为全部输出 token：

```js
palette: {
  primary, deep, light,       // 主色 / 深色（h1、h2、h4 文字）/ 亮色（引用装饰引号）
  accent,                     // 备用强调色
  quoteBg,                    // 引用底色（统一取浅一档）
  codeBg, codeText, codeLabel, codeTitleColor,
  inlineCodeBg, inlineCodeText,
  tableBorder,
  syntax: oneDark | githubLight,
  // 可选覆盖：text, gray, quoteText, quoteGray（深色及暖调主题需要）
}
```

### 七套主题

| id | 名称 | primary | deep → light | 引用底 | 代码底 | 行内代码 | 表边框 | 语法色板 |
|---|---|---|---|---|---|---|---|---|
| `blue-tech` | 蓝色科技 | `#2273b8` | `#1f5fa6 → #3a8ee6` | `#f0f6fb` | `#2a2f3a` | `#e8edf2/#4a7fa5` | `#d5e2ef` | One Dark |
| `orange-heart` | 橙心 | `#ff3502` | `#e6461f → #ff8052` | `#fdf3ee` | `#2d2a26` | `#ffece3/#d4380d` | `#ffd9cc` | One Dark |
| `violet` | 姹紫 | `#5d3587` | `#4a2a6b → #8e5fc0` | `#f7f2fb` | `#2b2436` | `#efe6f7/#6b3fa0` | `#e2d5f0` | One Dark |
| `green` | 绿意 | `#0e8c64` | `#0a6b4c → #3fb88f` | `#f0f9f5` | `#f6f8fa`（浅） | `#e6f4ef/#0e8c64` | `#cfe8df` | GitHub Light |
| `night` | 凝夜 | `#b39ddb` | `#5e35b1 → #7e57c2` | `#232733` | `#14161c` | `#2b3040/#b39ddb` | `#3a4152` | One Dark |
| `kami-paper` | 暖纸 | `#1B365D` | `#16283f → #3d5a80` | `#f0eee4` | `#faf9f4`（象牙浅） | `#efece1/#1B365D` | `#e3e0d3` | GitHub Light |
| `kimi-blue` | Kimi 蓝 | `#007CFF` | `#002F5B → #00A1FF` | `#f2f8ff` | `#0f2740` | `#e8f3ff/#007CFF` | `#E1E3E6` | One Dark |

「凝夜」为暗色主题，额外覆盖 `quoteText:#cfd4e3`、`quoteGray:#8b93a7`，避免浅字落在深底上不可读。

### 新主题完整调色板

```js
// kami-paper 暖纸 —— Kami 油墨蓝 #1B365D 唯一强调色，暖黄灰中性色
{ id:'kami-paper', name:'暖纸',
  primary:'#1B365D', deep:'#16283f', light:'#3d5a80', accent:'#b08d57',
  text:'#3d3b36', gray:'#8a867d',
  quoteBg:'#f0eee4', quoteText:'#5c5a52',
  codeBg:'#faf9f4', codeText:'#3d3b36', codeLabel:'#8a867d', codeTitleColor:'#1B365D',
  inlineCodeBg:'#efece1', inlineCodeText:'#1B365D',
  tableBorder:'#e3e0d3', syntax: githubLight }

// kimi-blue —— Kimi 品牌蓝 #007CFF + 深海军蓝 #002F5B，干净中性灰
{ id:'kimi-blue', name:'Kimi 蓝',
  primary:'#007CFF', deep:'#002F5B', light:'#00A1FF', accent:'#DFC8F5',
  text:'#2b2f33', gray:'#707070',
  quoteBg:'#f2f8ff', quoteText:'#3a4750',
  codeBg:'#0f2740', codeText:'#c9d6e3', codeLabel:'#7a93ab', codeTitleColor:'#A0DAF7',
  inlineCodeBg:'#e8f3ff', inlineCodeText:'#007CFF',
  tableBorder:'#E1E3E6', syntax: oneDark }
```

### 容器底色限制

Kami 原生的暖纸背景（`#f5f4ed`）**不可移植**：微信正文区域固定白底，粘贴后容器底色失效。暖纸主题的暖调改由 `quoteBg` / `inlineCodeBg` / `tableBorder` 的暖黄底承载，粘贴后依然保留。

### 换肤链路

```
用户选择 → themeId（localStorage 持久化）
→ getTheme(id) → render(src, { theme }) → env.theme → 全部规则 th(env)
```

---

## 14. 微信兼容约束清单

| 约束 | 实现 |
|---|---|
| 仅内联 style | 渲染器只产 `style="…"`，无 class、无 `<style>` |
| 不用 ul/ol/li | 列表 → `<p>` + 标记 span（见 §7） |
| 渐变降级 | 若使用 `linear-gradient`：纯色在前、渐变在后（当前输出无渐变） |
| 空格保形 | 代码空格 → `\u00a0` |
| 长行不溢出 | 代码行 `word-break:break-all` |
| 外链无效 | 链接 → 主题色加粗文本，丢弃 href |
| 外链图无效 | 图片 → base64 内嵌（文件名匹配） |
| 字体继承被打断 | 每个文字元素显式声明完整字体栈 |
| 中间字重不稳 | 不用 600：Android 微信仅 400/700 两档，标题/表头用 bold |
| 列表标记字符 | U+2022 BULLET 全端字体内置；不用 CSS 圆点 span（旧版渐变圆点已废弃） |
| 0.5pt 无 CSS 对应 | 分隔线用 `1px dashed`（微信最小可靠单位），视觉轻重等效 |
| 容器底色失效 | 微信正文白底；主题调性由组件底色（引用/行内代码/表边框）承载 |

---

## 15. 源码映射

| 文件 | 职责 |
|---|---|
| `src/core/themes.js` | 字体常量、语法色板、`buildTheme` 工厂、7 主题注册表、`getTheme` |
| `src/core/render.js` | markdown-it 规则：h2 色块、引用卡片、列表短横线标记、代码窗口、表格、图注、容器包裹 |
| `src/core/highlight.js` | hljs 高亮 → 逐行 token span（空格硬化在此） |
| `src/composables/useFormatter.js` | themeId 状态（localStorage）、图片匹配、渲染调度 |
| `test-render.mjs` | 回归测试：结构合规、多主题取色、表格、折行、图注格式、短横线标记、新主题注册 |
