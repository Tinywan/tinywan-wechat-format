<template>
  <transition name="toast">
    <div v-if="msg" class="toast" :class="type">{{ msg }}</div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('')
const type = ref('ok')
let timer = null

const show = (text, kind = 'ok', duration = 2500) => {
  msg.value = text
  type.value = kind
  clearTimeout(timer)
  timer = setTimeout(() => (msg.value = ''), duration)
}

defineExpose({ show })
</script>
