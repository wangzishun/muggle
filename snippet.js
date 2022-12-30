export const _compose = (middleware) => {
  return function (context, next) {
    const length = middleware.length

    const dispatch = (index) => {
      let func = middleware[index]

      if (index === length) {
        func = next
      }

      if (!func) {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(func(context, dispatch.bind(null, index + 1)))
      } catch (error) {
        return Promise.reject(error)
      }
    }

    dispatch(0)
  }
}

let middleware = []
middleware.push((context, next) => {
  console.log(1)
  next()
  console.log(1.1)
})
middleware.push((context, next) => {
  console.log(2)
  next()
  console.log(2.1)
})
middleware.push((context, next) => {
  console.log(3)
  next()
  console.log(3.1)
})

let fn = _compose(middleware)
fn({}, (ctx, next) => {
  console.log('next', next)
  next()
})
