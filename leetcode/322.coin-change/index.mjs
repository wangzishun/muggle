/**
 * @description 322. 零钱兑换
 * @see https://leetcode.cn/problems/coin-change/
 */

export const coinChange = (coins, amount) => {
  /**
   * dp[i] = x 表示，当目标金额为 i 时，至少需要 x 枚硬币
   *
   * base case: 当目标金额为 0 时，所需硬币数量为 0
   *
   * 最终返回的是 dp[amount]，如果 dp[amount] === Infinity，则表示无解
   */
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0

  for (let i = 1; i <= amount; i++) {
    /** 依次尝试使用不同类型的硬币凑出金额 i */
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
}
