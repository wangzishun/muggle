/**
 * @description 509. 斐波那契数
 * @see https://leetcode.cn/problems/fibonacci-number/
 */

export const fibV1 = (n) => {
  if (n === 0) {
    return 0
  }

  if (n === 1) {
    return 1
  }

  return fibV1(n - 1) + fibV1(n - 2)
}

export const fibV2 = (n) => {
  const map = new Map([
    [0, 0],
    [1, 1],
  ])

  const helper = (num) => {
    if (map.has(num)) {
      return map.get(num)
    }

    const result = fibV2(num - 1) + fibV2(num - 2)
    map.set(num, result)
    return result
  }

  return helper(n)
}

export const fibV3 = (n) => {
  const dp = new Array(n + 1).fill(0)
  dp[1] = 1

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[n]
}

export const fibV4 = (n) => {
  let previous = 0
  let current = 1

  for (let i = 0; i < n; i++) {
    const next = previous + current
    previous = current
    current = next
  }

  return previous
}
