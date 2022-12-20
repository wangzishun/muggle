/**
 *
 * @description 1541. 平衡括号字符串的最少插入次数
 * @see https://leetcode.cn/problems/minimum-insertions-to-balance-a-parentheses-string/
 */

/**
 * @param {string} s
 * @return {number}
 */
export const minInsertions = (s) => {
  const len = s.length

  const stack = []
  let need = 0

  for (let i = 0; i < len; i++) {
    if (s[i] === '(') {
      stack.push(s[i])
    }

    if (s[i] === ')') {
      if (stack.length === 0) {
        stack.push('(')
        need++
      }

      if (s[i + 1] === ')') {
        stack.pop()
        i++
      } else {
        stack.pop()
        need++
      }
    }
  }

  return stack.length * 2 + need
}
