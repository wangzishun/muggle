/**
 * @description 两数之和
 * @see https://leetcode.cn/problems/two-sum/
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
export const twoSumV1 = (nums, target) => {
  // {num: index}
  const mapping = {}

  for (let [index, num] of Object.entries(nums)) {
    const diff = target - num
    if (mapping[diff]) {
      return [mapping[diff], index]
    }

    mapping[num] = index
  }
}
