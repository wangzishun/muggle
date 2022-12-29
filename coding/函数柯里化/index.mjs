/**
 * https://github.com/mqyqingfeng/Blog/issues/42
 *
 *
 */

/**
 *
 * @param {*} func
 * @param {*} args
 * @returns
 */
export const _curry = function (func, args = []) {
  /** 记录需要的参数数量 */
  const length = func.length

  return function () {
    const newArgs = args.concat(Array.prototype.slice.call(arguments))

    /** 当参数数量满足条件时结束柯里化 */
    if (newArgs.length >= length) {
      return func.apply(this, newArgs)
    }

    return _curry.call(this, func, newArgs)
  }
}

/**
 * 请实现一个 add 函数，满足以下功能
 *
 * add(1); // 1
 * add(1)(2); // 3
 * add(1)(2)(3)；// 6
 * add(1)(2, 3); // 6
 * add(1, 2)(3); // 6
 * add(1, 2, 3); // 6
 */
export const _curryAddV1 = (...args) => {
  const curried = function (...newArgs) {
    return _curryAddV1(...args, ...newArgs)
  }

  curried.toString = function () {
    return args.reduce((previousValue, currentValue) => previousValue + currentValue)
  }

  return curried
}

export const _curryAddV2 = (...args) => {
  let sum = 0

  const run = function (...newArgs) {
    sum += newArgs.reduce((previousValue, currentValue) => previousValue + currentValue)

    return run
  }

  run.toString = function () {
    return sum
  }

  return run(...args)
}

// console.log(_curryAddV2(1, 2)(3)(4)(5, 6, 7, 8)(9).toString() === 45)
