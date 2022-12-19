const OwnThrottle = (func, limit, options) => {
  let context
  let args

  let previous = 0
  let timer

  if (!options) options = {}

  const throttled = function () {
    context = this
    args = arguments

    const now = Date.now()

    if (previous === 0 && options.leading === false) {
      previous = now
    }

    const remaining = limit - (now - previous)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
      }

      previous = now

      func.apply(context, args)
      timer = context = args = null
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(() => {
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
