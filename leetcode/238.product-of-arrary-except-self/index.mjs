/**
 *
 * @description 238. 除自身以外数组的乘积
 * @see https://leetcode.cn/problems/product-of-array-except-self/
 *
 */

/**
 * 对于位置 i，除自身以外的乘积等于左边所有元素的乘积 * 右边所有元素的乘积
 * 1. 先计算从左到右的乘积，对于位置 i，nums[i - 1] * 前 i - 1 个元素的结果
 * 2. 再计算从右到左的乘积
 *
 */
export const productExceptSelfV1 = (nums) => {
  const len = nums.length

  const fromLeft = Array(len)
  const fromRight = Array(len)

  // 先计算从左到右的乘积
  fromLeft[0] = 1
  for (let i = 1; i < len; i++) {
    fromLeft[i] = nums[i - 1] * fromLeft[i - 1]
  }

  // 再计算从右到左的乘积
  fromRight[len - 1] = 1
  for (let i = len - 2; i >= 0; i--) {
    fromRight[i] = nums[i + 1] * fromRight[i + 1]
  }

  // 对于位置i， 左边所有元素的乘积 * 右边所有元素的乘积
  // const result = Array(len)
  for (let i = 0; i < len; i++) {
    // result[i] = fromLeft[i] * fromRight[i]
    fromLeft[i] = fromLeft[i] * fromRight[i]
  }

  return fromLeft
}

/**
 * 要求使用 O(1) 的空间复杂度，除结果外不允许使用额外的数组
 */
export const productExceptSelfV2 = (nums) => {
  const len = nums.length

  const answer = Array(len)

  // 先计算从左到右的乘积
  answer[0] = 1
  for (let i = 1; i < len; i++) {
    answer[i] = nums[i - 1] * answer[i - 1]
  }

  // 再计算从右到左的乘积
  let fromRight = 1
  for (let i = len - 2; i >= 0; i--) {
    fromRight = fromRight * nums[i + 1]

    // 对于位置 i，左边所有元素的乘积 * 右边所有元素的乘积
    answer[i] = answer[i] * fromRight
  }

  return answer
}
