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
        <button :class="{ active: mode === 'pc' }" @click="$emit('mode-change', 'pc')" title="PC 预览">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          PC
        </button>
        <button :class="{ active: mode === 'mobile' }" @click="$emit('mode-change', 'mobile')" title="手机预览">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"></rect><line x1="11" y1="18" x2="13" y2="18"></line></svg>
          手机
        </button>
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
