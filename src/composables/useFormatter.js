import { ref, shallowRef, watch, computed } from 'vue'
import { render } from '../core/render.js'
import { createImageStore } from '../core/imageStore.js'
import { themes, getTheme, DEFAULT_THEME_ID } from '../core/themes.js'

const DRAFT_KEY = 'md-wechat-formatter:draft'
const THEME_KEY = 'md-wechat-formatter:theme'

export function useFormatter() {
  const markdown = ref(localStorage.getItem(DRAFT_KEY) || '')
  const themeId = ref(localStorage.getItem(THEME_KEY) || DEFAULT_THEME_ID)
  const html = shallowRef('')
  const warnings = ref([])
  const imageCount = ref(0)
  const lastImagesInfo = ref('')

  const store = createImageStore()

  const stats = computed(() => {
    const text = markdown.value.replace(/[#>*`\-\[\]!|]/g, '')
    return { chars: text.replace(/\s/g, '').length }
  })

  let timer = null
  const doRender = () => {
    const env = { warnings: [], resolveImage: store.resolve, theme: getTheme(themeId.value) }
    try {
      html.value = markdown.value.trim() ? render(markdown.value, env) : ''
    } catch (e) {
      html.value = ''
      env.warnings.push('渲染出错：' + e.message)
    }
    warnings.value = env.warnings
  }

  watch(
    markdown,
    (v) => {
      localStorage.setItem(DRAFT_KEY, v)
      clearTimeout(timer)
      timer = setTimeout(doRender, 300)
    },
    { immediate: true }
  )

  watch(themeId, (v) => {
    localStorage.setItem(THEME_KEY, v)
    clearTimeout(timer)
    doRender()
  })

  const refresh = () => {
    clearTimeout(timer)
    doRender()
  }

  const loadMarkdownFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        markdown.value = reader.result
        resolve(file.name)
      }
      reader.onerror = () => resolve(null)
      reader.readAsText(file, 'utf-8')
    })

  const addImages = async (files) => {
    const { added, dupes } = await store.addFiles(files)
    imageCount.value = store.count()
    lastImagesInfo.value = `已载入 ${added.length} 张${dupes.length ? `，${dupes.length} 张同名跳过` : ''}`
    refresh()
    return lastImagesInfo.value
  }

  const clear = () => {
    markdown.value = ''
    html.value = ''
    warnings.value = []
    localStorage.removeItem(DRAFT_KEY)
  }

  return { markdown, themeId, themes, html, warnings, imageCount, lastImagesInfo, stats, loadMarkdownFile, addImages, clear, refresh }
}
