/**
 * 6. Z 字形变换
 * @see https://leetcode.cn/problems/zigzag-conversion/
 */

const convert = (s, numRows) => {
  if (numRows === 1) return s

  const rows = Array(numRows).fill('')

  let direction = true // down: true,  up: false

  let pos = 0
  for (const char of s) {
    rows[pos] += char

    if (direction && pos < numRows - 1) {
      pos++
    } else if (!direction && pos > 0) {
      pos--
    } else {
      direction ? pos-- : pos++
      direction = !direction
    }
  }

  return rows.join('')
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

const cars = [
  ['PAYPALISHIRING', 3, 'PAHNAPLSIIGYIR'],
  ['PAYPALISHIRING', 4, 'PINALSIGYAHRPI'],
  ['wangzi', 1, 'wangzi'],
  ['123456789', 3, '159246837'],
]

describe('z 字形变换', () => {
  cars.forEach(([s, numRows, output]) => {
    it(s, () => {
      assert.equal(convert(s, numRows), output)
    })
  })
})
