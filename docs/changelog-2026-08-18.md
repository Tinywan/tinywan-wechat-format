# 样式变更摘要（2026-08-18）

本次更新围绕「字号向正文对齐」与「装饰收敛」，共 2 个提交，涉及 4 个文件。

| 提交 | 说明 |
|---|---|
| `e55b9f4` | 代码块字号 13px → 16px 与正文同号，移除引用块装饰引号 |
| `1535573` | 引用块文字 15px → 16px 与正文同号 |

---

## 1. 代码块字号 13px → 16px

**动机**：代码块字体偏小，手机上与正文（16px）反差明显，阅读费力。

**改动**：

- `code.line`（代码行）：13px → 16px
- `code.titleLine`（首行注释标题行）：13px → 16px
- `code.label`（语言标签）保持 11px 不变——属装饰性标注，不参与正文层级

**涉及文件**：`src/core/themes.js`、`docs/typography-spec.md`

## 2. 移除引用块首行 24px「"」装饰字符

**动机**：装饰引号（U+201C，`light` 浅主题色）视觉冗余，引用块回归纯卡片形态：浅底色 + 左侧 2px 主题色边线。

**改动**：

- `render.js` `blockquote_open` 不再输出 `<p class="mark">` 段落
- `themes.js` 删除 `blockquote.mark` 样式 token
- `light` 色板值保留，标注为「预留浅主题色」

**涉及文件**：`src/core/render.js`、`src/core/themes.js`、`test-render.mjs`（移除对应断言）、`docs/typography-spec.md`

## 3. 引用块文字 15px → 16px

**动机**：引用正文与正文同号，消除「引用字体偏小」的观感落差。

**改动**：

- `blockquote.text` / `blockquote.textGap`：15px → 16px
- `blockquote.signature`（`——` 签名行）保持 13px 不变
- 15px 密排档保留给表格（th/td）与 h2 数字色块

**涉及文件**：`src/core/themes.js`、`docs/typography-spec.md`

---

## 更新后字号速查

| 元素 | 字号 | 备注 |
|---|---|---|
| 正文 / 列表 | 16px | line-height 1.75 / 1.7 |
| 引用块文字 | **16px** | 本次由 15px 提升 |
| 代码块行 | **16px** | 本次由 13px 提升 |
| 行内代码 | 16px | 与正文同号 |
| 表格 th / td | 15px | 密排档，斑马纹不变 |
| h2 数字色块 | 15px | 描边芯片 |
| 图注 / 引用签名行 | 13px | 辅助信息档 |
| 代码块语言标签 | 11px | 装饰标注 |

## 验证

- `node test-render.mjs` 全部断言通过
- `test-output.html` 实测：代码行与引用文字均以 16px 内联样式输出，装饰引号字符已从输出中移除
