const quickSort = (arr, left, right) => {
  if (typeof left !== 'number') left = 0
  if (typeof right !== 'number') right = arr.length - 1

  if (left < right) {
    const pindex = partition(arr, left, right)

    quickSort(arr, left, pindex - 1)
    quickSort(arr, pindex + 1, right)
  }

  return arr
}


const partition = (arr, left, right) => {
  const pivot = arr[left]

  while (left < right) {
    while (left < right && arr[right] > pivot) {
      right--
    }

    arr[left] = arr[right]

    while (left < right && arr[left] < pivot) {
      left++
    }

    arr[right] = arr[left]
  }

  arr[left] = pivot
  return left
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('排序V1', () => {
  it('排序', () => {
    const arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 11]
    const res = quickSort(arr)
    console.info(res)
    assert.deepEqual(res, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})
