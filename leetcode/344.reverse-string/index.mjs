/**
 * @description 344. 反转字符串
 * @see https://leetcode.cn/problems/reverse-string/
 */

export const reverseString = (s) => {
  let left = 0
  let right = s.length - 1

  while (left < right) {
    ;[s[left], s[right]] = [s[right], s[left]]
    left++
    right--
  }

  return s
}
