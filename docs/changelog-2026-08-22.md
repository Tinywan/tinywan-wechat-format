# 样式变更摘要（2026-08-22）

本次更新两处，7 个主题统一生效：h3 恢复「左侧 4px 主色竖条」样式；引用块左边线 4px → 2px。共涉及 3 个文件。

---

## h3 恢复左侧 4px 主色竖条

**动机**：按目标排版稿对齐，h3 恢复左侧 4px 主色竖条，与左对齐主色字共同构成小节锚点；其余版式要素昨日已与目标稿一致，色板不变。

**改动**：

- `themes.js` h3 token：增加 `border-left:4px solid ${primary}` + `padding-left:10px`

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

---

## 验证

- `node test-render.mjs` 全部断言通过
- `test-output.html` 中 h3 输出含 `border-left:4px solid #2273b8`

---

## 引用块左边线 4px → 2px

**动机**：细线优先（v2 原则），引用边线与全局 2px 边线同档；h3 竖条维持 4px 不变。

**改动**：`themes.js` `blockquote.box` 的 `border-left` 4px → 2px。

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过；`test-output.html` 引用块输出含 `border-left:2px solid #2273b8`，h3 维持 `border-left:4px solid #2273b8`。

---

## 非标题字号统一 15px

**动机**：版面收敛——除标题外内容字号统一 15px，消除正文/引用/代码之间的字号跳跃；字体栈不变（排版目标稿与本项目同为 PingFang SC 优先栈，差异仅为渲染平台）。

**改动**：`paragraph`/`listItem`/`blockquote.text`/`blockquote.textGap` 16px → 15px；`code.line`/`code.titleLine`/`inlineCode`/`footerLead` 14px → 15px。标题、图注 13px、引用签名 13px 不动。

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过；`test-output.html` 正文输出为 `font-size:15px;line-height:1.7`。
