const normalize = (name) => {
  try { name = decodeURIComponent(name) } catch { /* keep raw */ }
  return name.trim().toLowerCase()
}

const basename = (src) => {
  const clean = src.split(/[?#]/)[0].replace(/\\/g, '/')
  const segs = clean.split('/')
  return segs[segs.length - 1]
}

export function createImageStore() {
  const map = new Map()

  const addFiles = (files) => new Promise((resolve) => {
    const list = Array.from(files)
    const added = []
    const dupes = []
    let pending = list.length
    if (!pending) return resolve({ added, dupes })
    for (const file of list) {
      const key = normalize(file.name)
      if (map.has(key)) { dupes.push(file.name); if (--pending === 0) resolve({ added, dupes }); continue }
      const reader = new FileReader()
      reader.onload = () => {
        map.set(key, reader.result)
        added.push(file.name)
        if (--pending === 0) resolve({ added, dupes })
      }
      reader.onerror = () => { if (--pending === 0) resolve({ added, dupes }) }
      reader.readAsDataURL(file)
    }
  })

  const resolve = (src) => {
    if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) {
      return { src, matched: true, external: true }
    }
    const key = normalize(basename(src))
    if (map.has(key)) return { src: map.get(key), matched: true, external: false }
    return { src, matched: false, external: false }
  }

  const count = () => map.size
  const clear = () => map.clear()

  return { addFiles, resolve, count, clear }
}
