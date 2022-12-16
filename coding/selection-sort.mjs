const swap = (arr, i, j) => {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

const selectionSort = (arr) => {
  const length = arr.length

  for (let i = 0; i < length; i++) {
    let pos = i

    for (let j = i + 1; j < length; j++) {
      if (arr[j] < arr[pos]) {
        pos = j
      }
    }

    swap(arr, i, pos)
  }

  return arr
}

const selectionSortV2 = (arr) => {
  const length = arr.length

  let left = 0
  let right = length - 1

  while (left < right) {
    let minPos = left
    let maxPos = right

    for (let i = left; i <= right; i++) {
      if (arr[i] < arr[minPos]) {
        minPos = i
      }

      if (arr[i] > arr[maxPos]) {
        maxPos = i
      }
    }

    // left minPos 交换
    swap(arr, left, minPos)

    // 如果 maxPos 等于 left，因为上一步把 minPos 交换到了 left，所以这里要交换 right minPos(原left, maxPos)
    if (maxPos === left) {
      maxPos = minPos
    }
    swap(arr, right, maxPos)

    left++
    right--
  }

  return arr
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('V1', () => {
  it(() => {
    const arr = [11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse()
    const res = selectionSortV2(arr)
    console.info(res)
    assert.deepEqual(res, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})
