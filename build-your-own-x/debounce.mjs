const _debounce = (func, delay, immediate) => {
  let timer
  const debounced = function () {
    if (timer) {
      clearTimeout(timer)
    }

    // 立即执行
    if (immediate) {
      // 之前没有执行过func时，立即执行
      if (!timer) {
        func.apply(this, arguments)
      }

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

  // 取消
  debounced.cancel = () => {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}
