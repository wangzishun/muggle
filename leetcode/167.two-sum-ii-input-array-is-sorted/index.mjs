/**
 * @description 167. 两数之和 II - 输入有序数组
 * @see https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/
 */

/**
 * 双指针
 */
export const twoSumV1 = (numbers, target) => {
  let left = 0
  let right = numbers.length - 1

  while (left < right) {
    const sum = numbers[left] + numbers[right]

    if (sum < target) {
      left++
    } else if (sum > target) {
      right--
    } else {
      return [left + 1, right + 1]
    }
  }
}

/**
 * 二分查找
 * @param {*} numbers
 * @param {*} target
 * @returns
 */
export const twoSumV2 = (numbers, target) => {
  const length = numbers.length

  for (let i = 0; i < length - 1; i++) {
    /** 当前元素值凑成 target 需要的另一个元素值 */
    const diff = target - numbers[i]

    let left = i + 1
    let right = length - 1
    while (left <= right) {
      const mid = (left + right) >> 1

      if (numbers[mid] < diff) {
        left = mid + 1
      } else if (numbers[mid] > diff) {
        right = mid - 1
      } else {
        return [i + 1, mid + 1]
      }
    }
  }
}
