/**
 * 冒泡排序
 * @see https://juejin.cn/post/6844903815716536333
 * @param {*} arr
 * @returns
 */

const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])

export const bubbleSortV1 = (arr) => {
  const times = arr.length - 1

  for (let i = times; i > 0; i--) {
    let alreadyInorder = true
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        alreadyInorder = false
        swap(arr, j, j + 1)
      }
    }

    if (alreadyInorder) {
      break
    }
  }

  return arr
}

export const bubbleSortV2 = (arr) => {
  let endPos = arr.length - 1

  while (endPos > 0) {
    const lastSwapPos = endPos

    for (let i = 0; i < lastSwapPos; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1)

        endPos = i
      }
    }

    if (endPos === lastSwapPos) {
      return arr
    }
  }

  return arr
}

export const bubbleSortV3 = (arr) => {
  let left = 0
  let right = arr.length - 1

  let startPos = 0
  let endPos = arr.length - 1

  while (left < right) {
    for (let i = left; i < right; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1)
        endPos = i
      }
    }

    if (right === endPos) return arr
    right = endPos

    for (let i = right; i > left; i--) {
      if (arr[i] < arr[i - 1]) {
        swap(arr, i, i - 1)
        startPos = i
      }
    }

    if (left === startPos) return arr
    left = startPos
  }

  return arr
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('冒泡排序V1', () => {
  it('冒泡排序', () => {
    const arr = [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()
    const res = bubbleSortV1(arr)
    console.info(res)
    assert.deepEqual(res, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})

describe('冒泡排序V2', () => {
  it('冒泡排序', () => {
    const arr = [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()
    const res = bubbleSortV2(arr)
    console.info(res)
    assert.deepEqual(res, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})

describe('冒泡排序V3', () => {
  it('冒泡排序', () => {
    const arr = [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()
    const res = bubbleSortV3(arr)
    console.info(res)
    assert.deepEqual(res, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})
