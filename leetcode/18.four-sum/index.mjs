/**
 * @description 四数之和
 * @see https://leetcode.cn/problems/4sum/
 */

export const fourSumV1 = function (nums, target) {
  const sortedNums = nums.slice().sort((a, b) => a - b)
  const lastIndex = sortedNums.length - 1

  const result = []

  for (let i = 0; i < lastIndex - 2; i++) {
    const tuples3 = threeSum(sortedNums, i + 1, lastIndex, target - sortedNums[i])
    result.push(...tuples3.map((tuple) => [sortedNums[i], ...tuple]))

    while (i < lastIndex - 2 && sortedNums[i] === sortedNums[i + 1]) {
      i++
    }
  }

  return result

  function threeSum(nums, start, lastIndex, target) {
    const result = []
    for (let i = start; i < lastIndex - 1; i++) {
      const tuples2 = twoSum(nums, i + 1, lastIndex, target - nums[i])

      result.push(...tuples2.map((tuple) => [nums[i], ...tuple]))

      while (i < lastIndex - 1 && nums[i] === nums[i + 1]) {
        i++
      }
    }

    return result
  }

  function twoSum(nums, start, end, target) {
    let left = start
    let right = end

    const result = []

    while (left < right) {
      const leftNum = nums[left]
      const rightNum = nums[right]

      const sum = leftNum + rightNum

      if (sum < target) {
        left++
      } else if (sum > target) {
        right--
      } else {
        result.push([leftNum, rightNum])

        while (left < right && leftNum === nums[left]) {
          left++
        }

        while (left < right && rightNum === nums[right]) {
          right--
        }
      }
    }

    return result
  }
}

export const nSumTarget = (nums, target) => {
  const sortedNums = nums.slice().sort((a, b) => a - b)
  const lastIndex = sortedNums.length - 1

  const helper = (snums, n, start, end, target) => {
    const result = []

    if (n === 2) {
      let left = start
      let right = end

      while (left < right) {
        const leftNum = snums[left]
        const rightNum = snums[right]

        const sum = leftNum + rightNum

        if (sum < target) {
          left++
        } else if (sum > target) {
          right--
        } else {
          result.push([leftNum, rightNum])

          while (left < right && leftNum === snums[left]) {
            left++
          }

          while (left < right && rightNum === snums[right]) {
            right--
          }
        }
      }
    } else {
      /**
       *
       */
      for (let i = start; i < end - n + 2; i++) {
        const tuples = helper(snums, n - 1, i + 1, end, target - snums[i])
        result.push(...tuples.map((tuple) => [snums[i], ...tuple]))

        while (i < end && snums[i] === snums[i + 1]) {
          i++
        }
      }
    }

    return result
  }

  return helper(sortedNums, 4, 0, lastIndex, target)
}
