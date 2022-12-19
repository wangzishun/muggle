const OwnDebounce = (func, delay, immediate) => {
  let timer
  const debounced = function () {
    if (timer) {
      clearTimeout(timer)
    }

    if (immediate) {
      if (!timer) {
        func.apply(this, arguments)
      }

      timer = setTimeout(() => {
        timer = null
      }, delay)
    } else {
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
