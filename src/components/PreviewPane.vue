<template>
  <div class="preview-pane">
    <div v-if="warnings.length" class="warn-bar">
      ⚠ {{ warnings.length }} 张图片未匹配到本地文件，粘贴后将无法显示。请点击「选择图片」载入。
    </div>
    <div class="preview-scroll">
      <div v-if="!html" class="empty">
        <p>左侧粘贴 Markdown 后，这里实时预览公众号排版效果</p>
        <p class="empty-sub">支持标题层级、引用提示框、代码块、图片图注、列表、表格等</p>
      </div>
      <div v-else class="preview-sheet">
        <div ref="contentEl" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  html: { type: String, default: '' },
  warnings: { type: Array, default: () => [] },
})

const contentEl = ref(null)
defineExpose({ contentEl })
</script>
