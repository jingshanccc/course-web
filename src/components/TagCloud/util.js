export function isColor(value) {
  const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/
  const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/
  const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/
  return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value)
}
export function randomColor() {
  const r = Math.floor(Math.random() * 75 + 100)
  const g = Math.floor(Math.random() * 75 + 130)
  const b = Math.floor(Math.random() * 75 + 100)
  // return 'hsl(' +
  //   Math.round(Math.random() * 360) + ',' +
  //   Math.round(Math.random() * 100) + '%,' +
  //   Math.round(Math.random() * 80) + '%)'
  // const r = Math.floor(Math.random() * 256)
  // const g = Math.floor(Math.random() * 64)
  // const b = Math.floor(Math.random() * 256)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

// 生成的size在 mean±sigma之间
export function randomSize(mean, sigma) {
  let u = 0.0
  let v = 0.0
  let w = 0.0
  do {
    // 获得两个（-1,1）的独立随机变量
    u = Math.random() * 2 - 1.0
    v = Math.random() * 2 - 1.0
    w = u * u + v * v
  } while (w === 0.0 || w >= 1.0)
  const c = Math.sqrt((-2 * Math.log(w)) / w)
  return mean + u * c * sigma
}

export function randomSplit(total, len, max) {
  let rest = total
  const result = Array.apply(null, { length: len })
    .map((n, i) => len - 1)
    .map(n => {
      const v = 1 + Math.floor(Math.random() * (max | rest / n * 2 - 1))
      rest -= v
      return v
    })
  result[len - 1] += rest
  return result
}

// 类正态排序 数组顺序：小-大-小
export function normalSort(arr) {
  const temp = []; let i = 0; const l = arr.length; const left = 0; const right = 0
  arr.sort((a, b) => { return b - a })
  while (arr.length > 1) {
    const a = arr.pop()
    const b = arr.pop()
    if (left < right) {
      temp[i] = b
      temp[l - (i + 1)] = a
    } else {
      temp[i] = b
      temp[l - (i + 1)] = a
    }
    i++
  }
  return temp
}

export default { isColor, randomColor, randomSize }
