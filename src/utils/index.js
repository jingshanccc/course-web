/**
 * 通过命名路由打开新页面
 * @param router 调用方法页面的router对象
 * @param name 新页面路由名
 * @param data 携带数据
 */
export function openHref(router, name, data) {
  const routeData = router.resolve({
    name: name,
    query: data
  })
  window.open(routeData.href, '_blank')
}

/**
 * 时长格式化
 * @param value 例如：36000
 * @param chinese 是否格式化为 中文模式 即 x时y分
 * @param subHour 是否在小时为0时删去小时位的00
 * @returns {string} 例如：10:00:00
 */
export function formatSecond(value, chinese = false, subHour = true) {
  value = value || 0
  let second = parseInt(value, 10) // 秒
  let minute = 0 // 分
  let hour = 0 // 小时
  if (second > 60) {
    // 当大于60秒时，才需要做转换
    minute = Math.floor(second / 60)
    second = Math.floor(second % 60)
    if (minute > 60) {
      hour = Math.floor(minute / 60)
      minute = Math.floor(minute % 60)
    }
  } else {
    // 小于60秒时，直接显示，不需要处理
  }
  if (chinese) {
    return hour + '小时' + minute + '分'
  } else {
    let result = '' + PrefixInteger(second, 2) + ''
    // 拼上分钟
    result = '' + PrefixInteger(minute, 2) + ':' + result
    // 拼上小时
    if (hour === 0 && subHour) {
      return result
    }
    result = '' + PrefixInteger(hour, 2) + ':' + result
    return result
  }
}

/**
 * 格式化指定长度，前面补0
 */
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length)
}
