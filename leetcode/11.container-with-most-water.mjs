/**
 *
 * @description 11. 盛最多水的容器
 * @see https://leetcode.cn/problems/container-with-most-water/
 *
 */

/**
 * 双指针从两边向中间移动，对于 [left, right] 区域的面积，显然是取决于比较矮的那个柱子，
 * min(height[left], height[right]) * (right - left)
 *
 * 移动时，优先移动比较矮的那个柱子，变大的可能性更大
 */
export const maxAreaV1 = (height) => {
  let result = 0

  let left = 0
  let right = height.length - 1

  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left)
    result = Math.max(result, area)

    if (height[left] < height[right]) {
      left++
    } else {
      right--
    }
  }

  return result
}
