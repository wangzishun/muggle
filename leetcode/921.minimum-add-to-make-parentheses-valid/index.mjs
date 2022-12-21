/**
 * @description 921. 使括号有效的最少添加
 * @see https://leetcode.cn/problems/minimum-add-to-make-parentheses-valid/
 */

/**
 *
 * @param {*} S
 * @returns
 */
export const minAddToMakeValid = (S) => {
  const stack = []
  let need = 0

  for (let str of S) {
    if (str === '(') {
      stack.push(1)
      continue
    }

    if (stack.length === 0) {
      need++
    } else {
      stack.pop()
    }
  }

  return stack.length + need
}
