<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <button @click="$emit('open-md')">打开 .md</button>
      <button @click="$emit('pick-images')">选择图片（{{ imageCount }}）</button>
      <button @click="$emit('load-sample')">示例文章</button>
      <select class="theme-select" :value="themeId" @change="$emit('theme-change', $event.target.value)">
        <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <div class="mode-switch">
        <button :class="{ active: mode === 'pc' }" @click="$emit('mode-change', 'pc')">PC</button>
        <button :class="{ active: mode === 'mobile' }" @click="$emit('mode-change', 'mobile')">手机</button>
      </div>
      <span class="status">{{ statusText }}</span>
    </div>
    <div class="toolbar-right">
      <button class="primary" :disabled="!hasHtml" @click="$emit('copy-rich')">复制富文本</button>
      <button :disabled="!hasHtml" @click="$emit('copy-html')">复制 HTML</button>
      <button :disabled="!hasHtml" @click="$emit('export')">导出</button>
      <button :disabled="!hasHtml" @click="$emit('clear')">清空</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageCount: { type: Number, default: 0 },
  statusText: { type: String, default: '' },
  hasHtml: { type: Boolean, default: false },
  themeId: { type: String, default: 'blue-tech' },
  themes: { type: Array, default: () => [] },
  mode: { type: String, default: 'pc' },
})
defineEmits(['open-md', 'pick-images', 'load-sample', 'theme-change', 'mode-change', 'copy-rich', 'copy-html', 'export', 'clear'])
</script>
