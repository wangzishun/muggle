//

const unique = (arr) => {
  const seen = new Set()
  return arr.filter((item) => {
    if (seen.has(item)) return false
    seen.add(item)
    return true
  })
}

// 数组去重
const uniqueV2 = (arr) => {
  return Array.from(new Set(arr))
}

// 手写数组扁平化函数
const flatten = (arr) => {
  return arr.reduce((prev, next) => {
    return prev.concat(Array.isArray(next) ? flatten(next) : next)
  }, [])
}

// curryAdd
const curryAdd = (...args) => {
  let sum = 0

  const run = function (...args) {
    sum = args.reduce((acc, cur) => acc + cur, sum)

    return run
  }

  run.toString = function () {
    return sum
  }

  return run(...args)
}

Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
  .catch(() => {
    throw new Error(1)
    console.log(3)
  })
  .then(() => {
    console.log(4)
  })
