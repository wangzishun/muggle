/**
 * 触发高频事件后的 n 秒内函数只会执行一次，如果 n 秒内再次被触发，则重新计算时间
 * @param {*} func
 * @param {*} delay
 * @param {*} immediate
 * @returns
 */
export const _debounce = (func, delay, immediate) => {
  let timer = null

  const debounced = function () {
    if (timer) clearTimeout(timer)

    // 立即执行
    if (immediate) {
      // 之前没有执行过func时，立即执行
      if (!timer) func.apply(this, arguments)

      timer = setTimeout(() => {
        timer = null
      }, delay)
    } else {
      // 延迟执行
      timer = setTimeout(() => {
        func.apply(this, arguments)
        timer = null
      }, delay)
    }
  }

  debounced.cancel = () => {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}

/**
 * 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率
 * @param {*} func
 * @param {*} limit
 * @param {*} options
 * @returns
 */
export const _throttle = (func, limit, options) => {
  let context
  let args
  let timer = null
  let previous = 0

  if (!options) options = {}

  const throttled = function () {
    context = this
    args = arguments
    const now = Date.now()

    // 第一次执行，且不立即执行
    if (previous === 0 && options.leading === false) previous = now

    // 计算剩余时间
    const remaining = limit - (now - previous)

    if (remaining <= 0) {
      if (timer) clearTimeout(timer)

      previous = now

      func.apply(context, args)
      timer = context = args = null
    } else if (!timer && options.trailing !== false) {
      // 延迟执行
      timer = setTimeout(() => {
        // 使得下一次执行时的 previous 为 0, 避免立即执行
        previous = options.leading === false ? 0 : Date.now()

        func.apply(context, args)
        timer = context = args = null
      }, remaining)
    }
  }

  throttled.cancel = () => {
    previous = 0
    timer = context = args = null
  }

  return throttled
}
