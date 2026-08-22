# 样式变更摘要（2026-08-22）

本次更新为 h3 单点样式恢复，7 个主题统一生效：h3 恢复「左侧 4px 主色竖条」样式。共涉及 3 个文件。

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

## h3 竖条 4px → 2px

**动机**：细线优先（v2 原则），与引用块 2px 边线同档，装饰进一步收敛。

**改动**：`themes.js` h3 token `border-left` 4px → 2px（仅 h3 竖条一处，blockquote 的 4px 不动）

**涉及文件**：`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

**验证**：`node test-render.mjs` 全部断言通过；`test-output.html` h3 输出含 `border-left:2px solid #2273b8`
