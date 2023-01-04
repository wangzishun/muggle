/**
 * @description 283. 移动零
 * @see https://leetcode.cn/problems/move-zeroes/
 */

export const moveZeroes = (nums) => {
  let pos = 0

  const length = nums.length

  for (let i = 0; i < length; i++) {
    if (nums[i] === 0) {
      continue
    }

    ;[nums[i], nums[pos]] = [nums[pos], nums[i]]
    pos++
  }

  return nums
}
