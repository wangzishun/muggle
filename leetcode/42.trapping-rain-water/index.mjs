/**
 *
 * @description 42.接雨水
 * @see https://leetcode.cn/problems/trapping-rain-water/
 *
 */

/**
 * 对于位置 i，能接的雨水量等于 min(左边最高的柱子, 右边最高的柱子) - height[i]
 */
export const trapV1 = (height) => {
  let result = 0
  const len = height.length

  for (let i = 1; i < len - 1; i++) {
    let leftMax = height[i]
    let rightMax = height[i]

    for (let j = i; j >= 0; j--) {
      leftMax = Math.max(leftMax, height[j])
    }

    for (let j = i; j < len; j++) {
      rightMax = Math.max(rightMax, height[j])
    }

    result += Math.min(leftMax, rightMax) - height[i]
  }

  return result
}

/**
 * 提前先计算每个位置 i 的左右两边最高的柱子
 */
export const trapV2 = (height) => {
  let result = 0
  const len = height.length

  const leftMax = Array(len).fill(height[0])
  const rightMax = Array(len).fill(height[len - 1])

  for (let i = 1; i < len; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i])
  }

  for (let i = len - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i])
  }

  for (let i = 1; i < len - 1; i++) {
    result += Math.min(leftMax[i], rightMax[i]) - height[i]
  }

  return result
}

/**
 *
 * 双指针从两边向中间移动，每次移动都会得出左右区间 [0, leftPos] 和 [rightPos, len - 1] 的最大值 leftMax 和 rightMax
 * 对于位置 i，能接的雨水量等于 min(leftMax, rightMax) - height[i]， 意味着只需要找比较小的那个值，然后减去当前位置的高度
 * 移动时也只需要移动比较小的那一边的指针
 */
export const trapV3 = (height) => {
  let result = 0

  let leftPos = 0
  let rightPos = height.length - 1

  let leftMax = height[leftPos]
  let rightMax = height[rightPos]

  while (leftPos < rightPos) {
    if (leftMax < rightMax) {
      leftPos++
      leftMax = Math.max(leftMax, height[leftPos])

      result += leftMax - height[leftPos]
    } else {
      rightPos--
      rightMax = Math.max(rightMax, height[rightPos])

      result += rightMax - height[rightPos]
    }
  }

  return result
}
