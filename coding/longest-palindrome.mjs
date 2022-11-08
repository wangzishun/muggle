/**
 * 最长回文子串
 *
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 * @param {*} s
 * @returns
 */
export const longestPalindrome = (s) => {
  const diffusion = (s, left, right) => {
    while (s[left] === s[right] && left >= 0 && right < s.length) {
      left--
      right++
    }

    return s.substring(left + 1, right)
  }

  const len = s.length

  let longest = ''

  for (let idx = 0; idx < len; idx++) {
    const odd = diffusion(s, idx, idx)
    const even = diffusion(s, idx, idx + 1)

    longest = odd.length > longest.length ? odd : longest
    longest = even.length > longest.length ? even : longest
  }

  return longest
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

const cars = [
  [
    'babad', // input
    'bab' // output
  ],
  [
    'cbbd', // input
    'bb' // output
  ],
  [
    'abcdbbfcba', // input
    'bb'
  ]
]

describe('最长回文子串', () => {
  cars.forEach(([input, output], idx) => {
    it(idx, () => {
      const res = longestPalindrome(input)
      console.info(res)
      assert.equal(res, output)
    })
  })
})
