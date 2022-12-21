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
      stack.push(1)
      continue
    }

    /** 没有匹配的左括号， 需要插入一个左括号 */
    if (stack.length === 0) {
      stack.push(1)
      need++
    }

    /**
     * 贪心
     * 下一个如果是右括号，满足一对二条件
     * 下一个如果不是右括号，需要插入一个右括号
     */
    if (s[i + 1] === ')') {
      stack.pop()
      i++
    } else {
      stack.pop()
      need++
    }
  }

  return stack.length * 2 + need
}
