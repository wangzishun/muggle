/**
 * @description 26. 删除有序数组中的重复项
 * @see https://leetcode.cn/problems/remove-duplicates-from-sorted-array/
 */

/**
 *
 */
export const removeDuplicates = (nums) => {
  let pos = 0

  const length = nums.length

  for (let i = 1; i < length; i++) {
    if (nums[i] === nums[pos]) {
      continue
    }

    nums[++pos] = nums[i]
  }

  return pos + 1
}
