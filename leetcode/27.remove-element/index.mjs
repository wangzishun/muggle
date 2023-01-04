/**
 * @description 27. 移除元素
 * @see https://leetcode.cn/problems/remove-element/
 */

/**
 *
 */
export const removeElement = (nums, val) => {
  let pos = 0

  const length = nums.length

  for (let i = 0; i < length; i++) {
    if (nums[i] === val) {
      continue
    }

    nums[pos++] = nums[i]
  }

  return pos
}
