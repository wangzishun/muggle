/**
 * build your own _Promise
 * @param executor
 */

/**
 * 模拟微任务
 */
const _nextTick = (func) => {
  if (typeof MutationObserver !== 'undefined') {
    const textNode = document.createTextNode('1')
    const observer = new MutationObserver(func)
    observer.observe(textNode, {
      characterData: true
    })
    textNode.textContent = '2'
    return
  }

  // @ts-ignore
  if (typeof setImmediate !== 'undefined') return setImmediate(func)

  setTimeout(func, 0)
}

/** 判断是否是 thenable 对象 */
const _isThenable = (x) => {
  return ((typeof x === 'object' && x !== null) || typeof x === 'function') && typeof x.then === 'function'
}

function OwnPromise(executor) {
  this.result = null
  this.status = 'pending'
  this.fulfilledCallbacks = []
  this.rejectedCallbacks = []

  const resolve = (value) => {
    if (this.status === 'pending') {
      this.status = 'fulfilled'
      this.result = value

      this.fulfilledCallbacks.forEach((fn) => fn(this.result))
    }
  }

  const reject = (reason) => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.result = reason
      this.rejectedCallbacks.forEach((fn) => fn(this.result))
    }
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
    throw error
  }
}

/**
 *
 * @param thenPromise then 返回的新 promise
 * @param callback then 传入的 的 onFulfilled 或者 onRejected，也就是上一个 promise 的成功或者失败的回调
 * @param result 上一个 promise 的成功或者失败的值
 * @param resolve 新 promise 的 resolve
 * @param reject 新 promise 的 reject
 */
const _resolvePromiseHelper = (thenPromise, callback, result, resolve, reject) => {
  _nextTick(() => {
    try {
      // then 的返回值 x
      const x = callback(result)

      if (x === thenPromise) {
        // x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
      }

      if (_isThenable(x)) {
        // x 是一个 thenable 对象，执行 x.then 方法
        x.then(resolve, reject)
      } else {
        // x 是一个普通值，传递给下一个 then
        resolve(x)
      }
    } catch (error) {
      // then 中抛出了异常
      reject(error)
    }
  })
}

OwnPromise.prototype.then = function (onFulfilled, onRejected) {
  // then 的参数 onFulfilled 和 onRejected 默认是一个函数
  if (typeof onFulfilled !== 'function') {
    onFulfilled = (v) => v
  }
  if (typeof onRejected !== 'function') {
    onRejected = (reason) => {
      throw reason
    }
  }

  let thenPromise

  // 每次执行完 promise.then 都是一个新的实例
  thenPromise = new OwnPromise((resolve, reject) => {
    // 根据状态执行对应的回调
    if (this.status === 'fulfilled') {
      _resolvePromiseHelper(thenPromise, onFulfilled, this.result, resolve, reject)
    } else if (this.status === 'rejected') {
      _resolvePromiseHelper(thenPromise, onRejected, this.result, resolve, reject)
    } else if (this.status === 'pending') {
      this.fulfilledCallbacks.push(() => _resolvePromiseHelper(thenPromise, onFulfilled, this.result, resolve, reject))
      this.rejectedCallbacks.push(() => _resolvePromiseHelper(thenPromise, onRejected, this.result, resolve, reject))
    }
  })

  return thenPromise
}

OwnPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

/**
 * 不管是 fulfilled 还是 rejected，都会执行
 * 值透传到下一个 then
 */
OwnPromise.prototype.finally = function (callback) {
  return this.then(
    (value) => OwnPromise.resolve(callback()).then(() => value),
    (reason) =>
      OwnPromise.resolve(callback()).then(() => {
        throw reason
      })
  )
}

OwnPromise.resolve = function (value) {
  return new OwnPromise((resolve) => resolve(value))
}

OwnPromise.reject = function (reason) {
  return new OwnPromise((resolve, reject) => reject(reason))
}

/**
 * 只有全部实例都 fulfilled，才会被解决
 */
OwnPromise.all = function (promises) {
  return new OwnPromise((resolve, reject) => {
    const result = []
    const length = promises.length
    let count = 0

    const processResultByKey = (value, index) => {
      result[index] = value
      count++
      if (count === length) resolve(result)
    }

    promises.forEach((promise, index) => {
      if (_isThenable(promise)) {
        promise.then((value) => {
          processResultByKey(value, index)
        }, reject)
      } else {
        processResultByKey(promise, index)
      }
    })
  })
}

/**
 * 只要有一个实例 fulfilled 或者 rejected，才会被解决
 */
OwnPromise.race = function (promises) {
  return new OwnPromise((resolve, reject) => {
    promises.forEach((promise) => {
      if (_isThenable(promise)) {
        promise.then(resolve, reject)
      } else {
        resolve(promise)
      }
    })
  })
}

/**
 * 只要有一个实例 fulfilled 或者 全部实例都 rejected，才会被解决
 */
OwnPromise.any = function (promises) {
  return new OwnPromise((resolve, reject) => {
    const length = promises.length
    let count = 0

    promises.forEach((promise) => {
      if (_isThenable(promise)) {
        promise.then(resolve, (reason) => {
          count++

          if (count === length) reject(reason) // new AggregateError([reason])
        })
      } else {
        count++
        resolve(promise)
      }
    })
  })
}

/**
 * 等到全部实例都 fulfilled 或者 rejected，才会被解决
 */
OwnPromise.allSettled = function (promises) {
  return new OwnPromise((resolve) => {
    const result = []
    const length = promises.length
    let count = 0

    const processResultByKey = (value, index) => {
      result[index] = value
      count++
      if (count === length) resolve(result)
    }

    promises.forEach((promise, index) => {
      if (_isThenable(promise)) {
        promise.then(
          (value) => {
            processResultByKey({ status: 'fulfilled', value }, index)
          },
          (reason) => {
            processResultByKey({ status: 'rejected', reason }, index)
          }
        )
      } else {
        processResultByKey({ status: 'fulfilled', value: promise }, index)
      }
    })
  })
}
