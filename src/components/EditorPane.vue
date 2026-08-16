<template>
  <div
    class="editor-pane"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <textarea
      :value="modelValue"
      placeholder="在此粘贴 Markdown 内容，或拖入 .md 文件……"
      spellcheck="false"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <input ref="mdInput" type="file" accept=".md,.markdown,.txt" hidden @change="onMdPicked">
    <input ref="imgInput" type="file" accept="image/*" multiple hidden @change="onImagesPicked">
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue', 'md-file', 'image-files'])

const mdInput = ref(null)
const imgInput = ref(null)

const openMd = () => mdInput.value && mdInput.value.click()
const pickImages = () => imgInput.value && imgInput.value.click()

const onMdPicked = (e) => {
  const file = e.target.files[0]
  if (file) emit('md-file', file)
  e.target.value = ''
}
const onImagesPicked = (e) => {
  if (e.target.files.length) emit('image-files', Array.from(e.target.files))
  e.target.value = ''
}
const onDrop = (e) => {
  const files = Array.from(e.dataTransfer.files)
  const mdFile = files.find((f) => /\.(md|markdown|txt)$/i.test(f.name))
  const images = files.filter((f) => /^image\//.test(f.type))
  if (mdFile) emit('md-file', mdFile)
  if (images.length) emit('image-files', images)
}

defineExpose({ openMd, pickImages })
</script>
