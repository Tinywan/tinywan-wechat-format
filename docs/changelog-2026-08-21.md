# 样式变更摘要（2026-08-21）

本次更新为两处「克制收敛」样式调整，7 个主题统一生效：`strong` 加粗从主题色虚线下划线改为主题色字色；全局字距 0.5px → 0.3px、正文阅读档行高 1.75 → 1.7。共涉及 4 个文件。

---

## strong 强调改为主题色字色

**动机**：微信中下划线易被误认为可点链接，强调一律改用主色字色表达，装饰收敛。

**改动**：

- `render.js` `strong_open`：去掉 `border-bottom:1px dashed ${primary}` 与引用块内 `strongColor` 叠加，一律输出 `color:${primary}`；文末（footer）区域内仍输出裸 `<strong>`
- `themes.js`：删除 `blockquote.strongColor` 样式 token（改后无引用）

**涉及文件**：`src/core/render.js`、`src/core/themes.js`、`test-render.mjs`、`docs/typography-spec.md`

---

## 验证

- `node test-render.mjs` 全部断言通过
- `test-output.html` 实测：`strong` 以 `color:#2273b8` 内联样式输出，输出中不再出现 `border-bottom:1px dashed`（hr 的 `border-top:1px dashed` 除外）

---

## 字距行高收敛（0.5px → 0.3px，阅读档 1.75 → 1.7）

**动机**：版面显大的主因是疏松度：字距 0.5px + 正文行高 1.75 偏膨；字号 16px 保持手机端标准不动。

**改动**：

- `paragraph` 行高 1.75→1.7
- `paragraph` / `listItem` / `blockquote.text` / `blockquote.textGap` / `tableTh` 字距 0.5→0.3
- 密排档行高（1.6/1.7）不动

**涉及文件**：`src/core/themes.js`、`docs/typography-spec.md`

**验证**：

- `node test-render.mjs` 全部断言通过
- `test-output.html` 中无 `letter-spacing:0.5px`
