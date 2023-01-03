/**
 * @description 5. 最长回文子串
 * @see https://leetcode.cn/problems/longest-palindromic-substring/
 */

export const longestPalindrome = (s) => {
  const length = s.length

  let maxRange = [0, 0]
  let maxLen = 1
  for (let i = 0; i < length; i++) {
    const oddRange = diffusion(s, i, i, length)
    const evenRange = diffusion(s, i, i + 1, length)

    const oddLen = oddRange[1] - oddRange[0] + 1
    const evenLen = evenRange[1] - evenRange[0] + 1

    if (oddLen > maxLen) {
      maxLen = oddLen
      maxRange = oddRange
    }

    if (evenLen > maxLen) {
      maxLen = evenLen
      maxRange = evenRange
    }
  }

  return s.slice(maxRange[0], maxRange[1] + 1)
}

const diffusion = (str, left, right, length) => {
  while (left >= 0 && right < length && str[left] === str[right]) {
    left--
    right++
  }

  return [left + 1, right - 1]
}
