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

---

## 标题阶梯下移（18 / 17 / 16）

**动机**：标题整体偏大，用户提出统一 16px；为保留层级区分度，改为阶梯整体下移：h1 20 → 18px、h2 19 → 17px、h3 17 → 16px。

**改动**：`themes.js` `h1`/`h2`/`h3` 三个 token 的 `font-size`。h3 样式其余要素（左对齐、主色、4px 竖条）不变；h4 维持 16px（与新 h3 同号，以颜色 deep/primary 及竖条区分）。

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过；h1 输出含 `font-size:18px`，h3 输出含 `font-size:16px;…border-left:4px solid #2273b8`。

---

## 字体栈更换为 Optima / PingFangSC-regular / serif

**动机**：用户指定全局统一字体为 `Optima, PingFangSC-regular, serif`。

**改动**：`themes.js` `FONT` 常量整体替换；所有引用 `${FONT}` 的 token（标题、正文、列表、引用、表格、图注、文末）自动生效。`MONO`（行内代码、代码块）维持 `Consolas,Menlo,monospace` 不变，保证代码等宽可读。

**平台表现**：macOS/iOS 英文与数字用 Optima、中文用苹方；Windows / Android 无这两款字体，回退系统 serif（如宋体），观感与此前雅黑栈差异较大。

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过；输出含 `font-family:Optima,PingFangSC-regular,serif`。

---

## 标题装饰层级重排（色块 h1 / 竖条 h2 / 小方块 h3）

**动机**：用户指定装饰样式整体上移一级——数字色块挂 h1（章节）、左侧竖条挂 h2（小节），h3 重新设计。

**改动**：

- `render.js`：core rule `h2_number_chip` → `h1_number_chip`（中性 token `h1_chip`/`h1_chip_close`），仅对 h1 抽取前导数字
- `themes.js`：`h2Chip` 更名 `h1Chip`；h2 改为左对齐主色 + 左 4px 竖条（保留 17px 与 48/24 段距）；h3 改为 16px `deep` 色加粗、无竖条
- `render.js` `heading_open`：h3 开标签注入主色 `▪`（U+25AA）小方块标记，复用 `listMarker` token
- `sample.md`：章节 `##` → `#`、小节 `###` → `##`，与新层级方案对齐；示例中无 h3 内容，h3 样式由测试片段覆盖

**字号不变**：18 / 17 / 16 阶梯保持，仅装饰样式迁移。

**涉及文件**：`src/core/render.js`、`src/core/themes.js`、`src/assets/sample.md`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过（h1 数字色块、色块序号 01、h2 左侧竖条、h3 小方块标记均 PASS）。
