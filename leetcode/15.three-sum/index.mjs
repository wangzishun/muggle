/**
 * @description 三数之和
 * @see https://leetcode.cn/problems/3sum/
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
export const threeSum = (nums) => {
  const sortedNums = nums.slice().sort((a, b) => a - b)
  const lastIndex = sortedNums.length - 1

  const result = []

  for (let i = 0; i < lastIndex - 1; i++) {
    const tuples = twoSum(sortedNums, i + 1, lastIndex, -sortedNums[i])

    result.push(...tuples.map((tuple) => [sortedNums[i], ...tuple]))

    while (i < lastIndex - 1 && sortedNums[i] === sortedNums[i + 1]) {
      i++
    }
  }

  return result
}

const twoSum = (nums, start, end, target) => {
  let left = start
  let right = end

  const tuples = []

  while (left < right) {
    const leftNum = nums[left]
    const rightNum = nums[right]

    const sum = leftNum + rightNum

    if (sum < target) {
      right--
    } else if (sum > target) {
      left++
    } else {
      tuples.push([leftNum, rightNum])

      while (left < right && leftNum === nums[left]) {
        left++
      }

      while (left < right && rightNum === nums[right]) {
        right--
      }
    }
  }

  return tuples
}
