/**
 * 给定两个数组，写一个方法来计算它们的交集
 *
 * @param arr1
 * @param arr2
 * @returns
 */
export const arrayIntersection = (arr1, arr2) => {
  return arr1.filter((item) => arr2.includes(item))
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

const cars = [
  [
    [1, 2, 2, 1], // arr1
    [2, 3, 2], // arr2
    [2, 2] // result
  ],
  [['name', 'wangzi', 'xiaozhang'], ['length', 'hallo', 'world'], []],
  [['name', 'wangzi', 'xiaozhang'], ['mail', 'hallo', 'wangzi'], ['wangzi']]
]

describe('计算两个数组的交集', () => {
  cars.forEach(([arr1, arr2, result], idx) => {
    it(idx, () => {
      const res = arrayIntersection(arr1, arr2)
      console.log(res)
      assert.deepEqual(res, result)
    })
  })
})
