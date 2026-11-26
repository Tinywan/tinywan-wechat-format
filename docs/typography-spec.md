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
6. **克制基线**（Kami × Kimi）：4px 间距网格；行距三档（标题 1.4 / 密排 1.6–1.7 / 阅读 1.7）；细线优先（2px 边线、1px 虚线仅用于分隔线），装饰收敛，强调色面积严控。

---

## 2. 字体

| Token | 取值 | 用途 |
|---|---|---|
| `FONT` | `Optima,PingFangSC-regular,serif` | 所有正文、标题、表格、图注 |
| `MONO` | `Consolas,Menlo,monospace` | 行内代码、代码块 |

### 字重策略

- 标题、表头、列表标记：`font-weight:bold`（700）；正文：400。
- **字体栈**：主用 `Optima`（macOS/iOS 内置人文无衬线），中文落 `PingFangSC-regular`，其余平台由 `serif` 系统兜底；不依赖 web 字体。
- **不用 600 中间字重**：Android 微信多数内核仅渲染 400/700 两档，600 会回退或触发合成粗体（违背「严禁合成粗体」初衷），层级靠字号与颜色而非中间字重。

---

## 3. 容器

整篇文章包裹在 `<section>` 中：

```css
max-width: 677px;   /* 微信正文经典阅读宽度 */
margin: 0 auto;
padding: 0 16px;    /* 必须保留：置 0 后粘贴进微信编辑器预览会变样（实测） */
```

---

## 4. 标题

| 级别 | 字号 | 行高 | 颜色 | 对齐 | 其他 |
|---|---|---|---|---|---|
| h1 | 18px | 26px | `deep` | 居中 | 极简纯净留白，无背景色块；margin `36px 0 24px` |
| h2 | 17px | 25px | `deep` | 居中 | 居中对齐，支持数字色块（chip），带文字等宽 1px 主色底横线；margin `48px 0 24px` |
| h3 | 16px | 24px | `primary` | 左 | 主色字符竖杆 `▎` 前置（避免微信清除空 span）；margin `32px 0 16px` |
| h4 | 16px | 24px | `deep` | 左 | 主色小方块 `▪` 前置；margin `0 0 14px` |

所有标题 `font-weight:bold`。h1 采用极简纯净留白风格，18px 居中加粗定调全文；h2 采用 17px 居中对齐，支持 01、02 数字描边色块（chip）并带文字等宽 1px 主色底横线；h3 采用 16px 主色字符竖杆 `▎` 前置强调；h4 继承深主色 + 前置主色小方块。

### 行距规范（规避微信 #2.3.2 误判）

微信公众号后台及插件校验规则 `#2.3.2 line-height-overlapping` 会将无单位行高误判为像素值（如 `1.7 < 15` 报错“行高小于字号”）。为彻底消除报警并保证多端绝对不重叠，统一采用明确像素值：

| 档位 | 值 | 应用 |
|---|---|---|
| 标题档 | 24px–26px | h1 (26px)、h2 (25px)、h3 (24px)、h4 (24px) |
| 密排档 | 22px–27px | 列表 22px、引用 26px、代码 24px、表格 24px |
| 阅读档 | 26px | 正文段落（15px 字号下实测约 1.73 倍，通透自然） |

### h1 极简留白标题

h1 作为文章主标题，摒弃笨重色块，采用极简留白排版，字号收束至 18px 居中加粗，开篇纯净通透：

```css
font-size: 18px;
font-weight: bold;
text-align: center;
color: #1f5fa6;                 /* 主题深主色 deep */
line-height: 26px;
margin: 36px 0 24px 0;
```

### h2 数字色块与等宽底横线（chip + border-bottom）

h2 以数字开头（匹配 `^(\d{1,2})[\s、.．·]+`，如 `1、`、`2.`、`3 `）时，数字被抽出为描边色块，单位数补零为两位（`01`、`02`……）：

```css
display:inline-block; width:26px; height:26px;  /* 正方形色块，长方形 padding 版已废弃 */
box-sizing:border-box; line-height:24px; text-align:center;
border:1px solid #2273b8; border-radius:4px; color:#2273b8; font-weight:bold;
font-size:14px;                               /* 两位数字收一档，保证方正 */
margin-right:10px; vertical-align:middle;
```

同时，h2 内容整体包裹于行内块包装器中，在其下方呈现一条与文字/色块等宽的 1px 主色底边线，精致轻盈、视觉居中对齐：

```css
display: inline-block;
border-bottom: 1px solid #2273b8;  /* 主色 primary 细横线 */
padding-bottom: 6px;              /* 文字与横线间的呼吸间距 */
max-width: 100%;
box-sizing: border-box;
```

描边芯片呼应全局「细线优先」，与虚线分隔线、2px 引用边线同属一套克制语言；无渐变填充，天然免除降级问题。

实现要点：core rule 在解析期产出中性 token（`h2_chip`/`h2_chip_close`），渲染期才套用 env 主题 —— 解析与配色解耦。

### h3 字符竖杆标记

h3 左侧使用真实文本字符 `▎`（U+258E LEFT ONE QUARTER BLOCK），不再使用空的 CSS 色块 `<span>`。微信编辑器粘贴时可能清除无内容节点，而字符竖杆与 h4 的 `▪` 一样会作为正文保留：

```css
display:inline-block; width:4px;
color:#2273b8; font-weight:bold;
font-size:16px; line-height:24px;
margin-right:8px; vertical-align:0;
font-family:Optima,PingFangSC-regular,serif;
```

字符在 16px 字号下形成主色直角竖杆，外层以 `width:4px` 固定占位，保留 4px 杆宽与 8px 右侧间距；不使用 `overflow:hidden`，避免行内块基线下移至盒底而与标题文字错位。即使微信忽略尺寸，竖杆仍作为文本字符保留，不再依赖空元素的背景样式。

### h4 小方块标记

h4 由渲染器在标题文字前注入 `<span style="color:{primary};font-weight:bold;">▪</span>&nbsp;`（复用 listMarker token，U+25AA BLACK SMALL SQUARE，主色加粗）；标题文字本身为 `deep` 色 16px 加粗，无竖条无底线。

---

## 5. 正文段落

```css
font-size:15px; line-height:26px; letter-spacing:0.3px;
color:#333; text-align:justify;
margin:0 0 24px 0;
```

- `text-align:justify` 两端对齐，中文排版更整齐；
- `letter-spacing:0.3px` 微字距（1px → 0.5px 再收紧至 0.3px，去松散感）；
- 段间距 24px（6×4 网格）：行高收紧后以段间留白补偿节奏。

### 文末居中

最后一个 `---` 之后、首段以 `——` 开头的段落组识别为文末（如 `**—— 如果这篇对你有帮助 ——**`），居中渲染；文档无 `---` 时回退：取最后一个引用块外、以 `——` 开头的段落为文末起点（避免误中引用块内的 `——` 署名行）。

| 段落 | 样式 |
|---|---|
| 引导行（以 `——` 开头） | 15px、`primary`、line-height 27px、居中、margin `30px 0 8px` |
| 其余各段 | 15px、line-height 30px、居中、margin `0 0 8px` |

文末内 `**加粗**` 只输出裸 `<strong>`（无主题色，继承段色）。参考资料等位于两个 `---` 之间的段落不识别为文末，保持正文样式。

---

## 6. 行内元素

| 元素 | 输出 | 说明 |
|---|---|---|
| `**加粗**` | `<strong>` | 一律 `primary` 主题色字色、无下划线；文末区域内输出裸 `<strong>` |
| `*斜体*` | `<em>` | 原样输出 |
| `[链接](url)` | 主题色加粗 `<span>` + 灰色小字地址 | 公众号正文外链无效，链接文字保留 `color:${primary};font-weight:bold;word-break:break-all`，其后以 `（原始 URL）` 形式附灰色小字（12px / 22px / gray / `word-break:break-all`）供读者追溯；链接文字与 href 相同（裸链接）或为 `mailto:` 时不重复附地址 |
| 软/硬换行 | `<br>` | — |

### 行内代码

```css
background:#f3f6f8; color:#4a7fa5;   /* blue-tech 取值 */
border-radius:3px; padding:1px 6px;
font-size:15px; font-family:Consolas,Menlo,monospace;
word-break:break-all;
```

字号 15px 与正文一致（代码块为 14px）。`word-break:break-all`：justify 段落中长标识符若不折行，会整块挤到下一行，上一行余白被两端对齐均摊成字距拉伸。

---

## 7. 列表

微信不保留 `ul/ol`，统一输出为 `<p>` + 标记。列表项公共样式：

```css
font-size:15px; line-height:22px; letter-spacing:0.3px; color:#333;
text-align:left;                        /* 短句列表不用 justify，避免字距被拉散 */
padding-left:14px; text-indent:-14px;   /* 悬挂缩进：折行后文字对齐首行文字 */
margin:0 0 8px 8px;                     /* 项距 8px；整体左缩进 8px，标记不越过正文左缘 */
```

列表作为整体与前后正文保持 16px 间距：列表前的普通段落将 `margin-bottom` 从 24px 调整为 16px，列表最后一项将 `margin-bottom` 从 8px 调整为 16px；中间各项仍为 8px，普通正文之间的 24px 段距不变。

### 标记统一为 10px 定宽 inline-block + 1 空格

无序方块与有序数字共用同一套定位模型：`10px` 定宽标记盒 + 尾部 `&nbsp;`（约 4px），合计约 14px，与 14px 悬挂缩进精确对齐；首行 `text-indent:-14px` 让标记盒伸到缩进区，折行文字与首行文字左缘齐平。位数变化（`1.` → `10.`）不改变文字起点，不会错位。盒宽克制在 10px，方块与正文之间的空隙约 5px，紧凑但不粘连。

### 无序列表：主题色小方块

```html
<span style="display:inline-block;width:10px;text-align:center;color:#2273b8;font-weight:bold;font-size:8px;vertical-align:2px;">■</span>&nbsp;
```

- 字符为 U+25AA 同族的 U+25A0 BLACK SQUARE：字形比 `▪` 大一圈，8px 字号下实际渲染约 5–6px，清晰挺括（`▪` 同字号仅约 3px，过小发虚）；
- 方块在 10px 盒内水平居中，`vertical-align:2px` 上提至文字视觉中线；
- 方块取主色 `primary`，与有序数字、h4 `▪` 前缀、加粗引导词同属一套主题强调语言；面积仅约 6px²，点缀而不喧哗。

### 有序列表：主题色数字

```html
<span style="display:inline-block;width:10px;text-align:right;color:#2273b8;font-weight:bold;">1.</span>&nbsp;
```

- 数字在 10px 盒内右对齐，个位/两位数的文字起点一致（数字超出盒宽时向左溢出，不推挤正文）；
- 计数器由渲染器维护（支持嵌套，各层独立计数）；
- 嵌套层级用 3 个 `\u00a0` × 层深做缩进。

---

## 8. 引用块

输出为 `<section>` 卡片（非 `<blockquote>`），Kami 式细边线：

```css
/* 外框：显式指定 font-size 与 line-height，消除微信 #2.3.2 对包含多行文本的 section 容器的误判 */
background:#f0f6fb;                     /* quoteBg，各主题统一调浅一档 */
border-left:2px solid #2273b8;          /* 引用左线细边线，与全局 2px 边线同档；笔直无弧度 */
padding:16px 20px; margin:0 0 20px 0;
font-size:15px; line-height:26px;

/* 段落 */
font-size:15px; line-height:26px; letter-spacing:0.3px;
color:#333; margin:0;                    /* 末段，与正文同号 */
/* 非末段 margin 改为 0 0 8px，段间留缝 */
```

特殊规则：

| 规则 | 说明 |
|---|---|
| 签名行 | 以 `——` 开头的段落：13px、`gray` 色（`#8a94a0`）、line-height 23px |
| 加粗着色 | 引用内 `**加粗**` 着 `primary` 色 |
| 字距 | 引用文字 `letter-spacing:0.3px`，与正文字感一致 |

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

## 10. 代码块（macOS 浅灰窗口与长行横滑）

```css
/* 外层：超长代码行横向滚动 */
display:block; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch;
margin:0 0 20px 0;
/* 中层：双行表格承载圆点顶栏与代码区（微信最稳的结构载体） */
border-collapse:separate; border-spacing:0; width:100%; margin:0;
background:#e9edf1; border:none;
border-radius:6px; overflow:hidden;
/* 圆点顶栏 td：独立浅灰底与细分隔线 */
background:#dde2e7; color:#8a919c; border:none; border-bottom:1px solid #d2d8df;
padding:8px 16px; font-size:12px; line-height:20px;
font-weight:normal; letter-spacing:0; text-align:left;
/* 代码区 td：左右 16px 内边距 */
background:#e9edf1; border:none; padding:12px 16px 16px;
text-align:left; white-space:nowrap; word-break:normal;
word-wrap:normal; overflow-wrap:normal;
```

圆点依次使用 `●#ff5f56`、`●#ffbd2e`、`●#27c93f`，字号 16px、右侧间距 8px，以真实彩色字符而非空元素 + `border-radius:50%` 实现，避免微信清除空节点或剥离圆形样式。表格外框及两个单元格均显式 `border:none`，防止微信默认表格样式补回边框；顶栏仅保留 `1px` 下分隔线。语言标识只用于语法高亮，不再输出可见标签；圆点顶栏 `#dde2e7` 与代码区 `#e9edf1` 形成 macOS 浅灰窗口层次。除 `highlight.js/lib/common` 外，显式注册 Dockerfile 语言并支持 `docker` 别名，避免这类代码块静默退化为无高亮纯文本。

代码只保留源码中的原始换行，不在手机端自动折行：每个代码行使用块级 `<span>` 而非 `<p>`，避免微信编辑器重写段落的白空格与断词样式；`white-space:nowrap` 配合 `\u00a0` 保留缩进与完整代码行，不再追加 `<wbr>` 折行点；`word-break:normal`、`word-wrap:normal`、`overflow-wrap:normal` 禁止从 token 中间断行。长行由外层 `max-width:100%`、`overflow-x:auto` 与 `-webkit-overflow-scrolling:touch` 承载横向滚动，代码单元格与每行继续显式 `text-align:left`，防止微信编辑器的两端对齐拉伸空格。

### 代码行与序号（Line Numbers）

```css
/* 代码行：块级 span，避免微信重写 p 样式 */
display:block; font-size:13px; line-height:22px; color:#3f4650;
font-family:Consolas,Menlo,monospace;
text-align:left; white-space:nowrap; word-break:normal;
word-wrap:normal; overflow-wrap:normal;
margin:0;

/* 可选代码行号 */
display:inline-block; text-align:right; margin-right:12px;
color:#8a919c; font-family:Consolas,Menlo,monospace;
font-size:12px; line-height:22px; user-select:none;
/* 宽度根据总行数动态计算（1~99 行统一 20px） */
```

- **全行严谨连续**：开启行号后，所有行统一带有连续自然序号，严格对齐编辑器行号；
- **自适应右对齐**：根据代码总行数自动计算行号宽度，多行工整右对齐；
- **微信行高合规**：行号显式定义 `font-size:12px; line-height:22px;`，彻底防御微信 `#2.3.2` 误判；
- **工具栏快捷切换**：默认关闭以匹配简洁参考样式，顶部工具栏提供「行号」开关；
- 空格硬化为 `\u00a0` 保对齐，不插入 `<wbr>`，避免手机端出现额外折行点（高亮管线处理）；
- **首行注释弱化**：若首行整行是注释，套用 `titleLine`，以 `codeTitleColor`（`#8a919c`）和正常字重显示。

### 全主题统一浅灰终端

7 个主题代码块统一 `codeBg:#e9edf1`、`codeHeaderBg:#dde2e7`、`codeBorder:#d2d8df`、`codeText:#3f4650`、`codeLabel:#8a919c`、`codeTitleColor:#8a919c` + 低饱和浅灰语法板；仅代码区使用浅灰底，文章正文与各主题强调色不变。

### 语法高亮色板（低饱和浅灰）

| 语义 | 取值 |
|---|---|
| comment / quote | `#8a919c` |
| string / number / attr | `#9a6a16` |
| keyword / meta | `#3f4650` |
| title / function | `#3f4650` |
| class / type | `#9a6a16` |
| built_in（如 Shell `exec`） | `#3f4650` + 加粗 |
| variable / tag | `#9a6a16` |
| symbol / bullet / addition | `#4d7c5b` |

---

## 11. 表格

```css
/* table */
border-collapse:collapse; width:100%;
margin:0 0 20px 0;

/* th */
background:#2273b8; color:#ffffff;
font-size:15px; font-weight:bold; line-height:1.6; letter-spacing:0.3px;
padding:8px 12px; border:1px solid #2273b8; text-align:left; white-space:nowrap;

/* td */
font-size:15px; line-height:1.6; color:#333;
padding:8px 12px; border:1px solid #d5e2ef;   /* tableBorder */
text-align:left; vertical-align:top;

/* 斑马纹：第 2、4… 数据行 td 前置 */
background:#f0f6fb;                     /* zebraBg，默认回落 quoteBg */
```

15px 密排档统一内容字号；padding 走 4px 网格。斑马纹直接写在 td 内联样式上（tr 样式粘贴易丢），表头行不参与。斑马底色独立 token `zebraBg`（默认取 `quoteBg`）：凝夜等深色引用块主题必须单独配浅斑纹色（凝夜 `#efeaf7`），否则深底撞上默认深字 `#333` 无法阅读。

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
  primary, deep, light,       // 主色 / 深色（h1、h2、h4 文字）/ 亮色（预留浅主题色）
  accent,                     // 备用强调色
  quoteBg,                    // 引用底色（统一取浅一档）
  codeBg, codeText, codeLabel, codeTitleColor,
  inlineCodeBg, inlineCodeText,
  tableBorder,
  syntax: lightMuted,             // 全主题统一低饱和浅灰色板
  // 可选覆盖：text, gray, quoteText, quoteGray, codeHeaderBg, codeBorder
}
```

### 七套主题

| id | 名称 | primary | deep → light | 引用底 | 代码底 | 行内代码 | 表边框 | 语法色板 |
|---|---|---|---|---|---|---|---|---|
| `blue-tech` | 蓝色科技 | `#2273b8` | `#1f5fa6 → #3a8ee6` | `#f0f6fb` | `#e9edf1` | `#f3f6f8/#4a7fa5` | `#d5e2ef` | 低饱和浅灰 |
| `orange-heart` | 橙心 | `#ff3502` | `#e6461f → #ff8052` | `#fdf3ee` | `#e9edf1` | `#ffece3/#d4380d` | `#ffd9cc` | 低饱和浅灰 |
| `violet` | 姹紫 | `#5d3587` | `#4a2a6b → #8e5fc0` | `#f7f2fb` | `#e9edf1` | `#efe6f7/#6b3fa0` | `#e2d5f0` | 低饱和浅灰 |
| `green` | 绿意 | `#0e8c64` | `#0a6b4c → #3fb88f` | `#f0f9f5` | `#e9edf1` | `#e6f4ef/#0e8c64` | `#cfe8df` | 低饱和浅灰 |
| `night` | 凝夜 | `#b39ddb` | `#5e35b1 → #7e57c2` | `#232733` | `#e9edf1` | `#2b3040/#b39ddb` | `#3a4152` | 低饱和浅灰 |
| `kami-paper` | 暖纸 | `#1B365D` | `#16283f → #3d5a80` | `#f0eee4` | `#e9edf1` | `#efece1/#1B365D` | `#e3e0d3` | 低饱和浅灰 |
| `kimi-blue` | Kimi 蓝 | `#007CFF` | `#002F5B → #00A1FF` | `#f2f8ff` | `#e9edf1` | `#e8f3ff/#007CFF` | `#E1E3E6` | 低饱和浅灰 |

「凝夜」为暗色主题，额外覆盖 `quoteText:#cfd4e3`、`quoteGray:#8b93a7`，避免浅字落在深底上不可读。

### 新主题完整调色板

```js
// kami-paper 暖纸 —— Kami 油墨蓝 #1B365D 唯一强调色，暖黄灰中性色
{ id:'kami-paper', name:'暖纸',
  primary:'#1B365D', deep:'#16283f', light:'#3d5a80', accent:'#b08d57',
  text:'#3d3b36', gray:'#8a867d',
  quoteBg:'#f0eee4', quoteText:'#5c5a52',
  codeBg:'#e9edf1', codeText:'#3f4650', codeLabel:'#8a919c', codeTitleColor:'#8a919c',
  inlineCodeBg:'#efece1', inlineCodeText:'#1B365D',
  tableBorder:'#e3e0d3', syntax: lightMuted }

// kimi-blue —— Kimi 品牌蓝 #007CFF + 深海军蓝 #002F5B，干净中性灰
{ id:'kimi-blue', name:'Kimi 蓝',
  primary:'#007CFF', deep:'#002F5B', light:'#00A1FF', accent:'#DFC8F5',
  text:'#2b2f33', gray:'#707070',
  quoteBg:'#f2f8ff', quoteText:'#3a4750',
  codeBg:'#e9edf1', codeText:'#3f4650', codeLabel:'#8a919c', codeTitleColor:'#8a919c',
  inlineCodeBg:'#e8f3ff', inlineCodeText:'#007CFF',
  tableBorder:'#E1E3E6', syntax: lightMuted }
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
| 长行不折行 | 代码块保留原始换行（`white-space:nowrap` + `word-break:normal` + `overflow-wrap:normal`，旧环境以 `word-wrap:normal` 兼容），超长行由外层 `overflow-x:auto` 横向滚动；行内代码 `word-break:break-all` |
| 外链无效 | 链接 → 主题色加粗文本 + 灰色小字原始 URL（裸链接不重复），`word-break:break-all` 防 justify 拉伸 |
| 外链图无效 | 图片 → base64 内嵌（文件名匹配） |
| 字体继承被打断 | 每个文字元素显式声明完整字体栈 |
| 中间字重不稳 | 不用 600：Android 微信仅 400/700 两档，标题/表头用 bold |
| 列表标记字符 | U+25A0 主色实心方块全端字体内置（`▪` 字形过小已弃用）；不用 CSS 圆点 span（旧版渐变圆点已废弃） |
| 0.5pt 无 CSS 对应 | 分隔线用 `1px dashed`（微信最小可靠单位），视觉轻重等效 |
| 容器底色失效 | 微信正文白底；主题调性由组件底色（引用/行内代码/表边框）承载 |

---

## 15. 源码映射

| 文件 | 职责 |
|---|---|
| `src/core/themes.js` | 字体常量、语法色板、`buildTheme` 工厂、7 主题注册表、`getTheme` |
| `src/core/render.js` | markdown-it 规则：h1 色块、h3 字符竖杆、引用卡片、列表短横线标记、代码窗口、表格、图注、容器包裹 |
| `src/core/highlight.js` | hljs 高亮 → 逐行 token span（空格硬化在此） |
| `src/composables/useFormatter.js` | themeId 状态（localStorage）、图片匹配、渲染调度 |
| `test-render.mjs` | 回归测试：结构合规、多主题取色、表格、折行、图注格式、短横线标记、新主题注册 |
