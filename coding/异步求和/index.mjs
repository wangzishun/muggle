/**
 * 提供一个异步 add 方法如下，需要实现一个 await sum(...args) 函数
 * @param {*} a
 * @param {*} b
 * @param {*} callback
 */

/** 异步 add 方法 */
const addTwoTimeout = (a, b, callback) => {
  setTimeout(function () {
    callback(null, a + b)
  }, 500)
}

/** promisify */
const addTwoAsync = (a, b) => {
  return new Promise((resolve) => {
    addTwoTimeout(a, b, (_, sum) => {
      resolve(sum)
    })
  })
}

/**
 * 串行求和
 * @param  {...any} nums
 * @returns
 */
const serialSumAsync = (...nums) => {
  return nums.reduce((prev, cur) => {
    return prev.then((total) => addTwoAsync(total, cur))
  }, Promise.resolve(0))
}

/**
 * 并行求和
 * @param  {...any} nums
 */
const parallelSumAsync = (...nums) => {
  if (nums.length === 1) {
    return nums[0]
  }

  let len = nums.length

  const list = []
  while (len > 0) {
    list.push(addTwoAsync(nums.pop() || 0, nums.pop() || 0))
    len -= 2
  }

  return Promise.all(list).then((sums) => parallelSumAsync(...sums))
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('异步加法', () => {
  it('异步加法', (done) => {
    addTwoTimeout(1, 2, (err, result) => {
      assert.equal(result, 3)
      done()
    })
  })

  it('promisify', async () => {
    const result = await addTwoAsync(1, 2)
    assert.equal(result, 3)
  })

  it('串行加法求和', async () => {
    const result = await serialSumAsync(1, 2, 3, 4, 5, 6, 7, 8)
    assert.equal(result, 36)
  })

  it('并行加法求和', async () => {
    const result = await parallelSumAsync(1, 2, 3, 4, 5, 6, 7, 8)
    assert.equal(result, 36)
  })
})
