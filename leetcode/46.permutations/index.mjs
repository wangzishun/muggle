import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

/**
 * @description 46.permutations 全排列
 * @see https://leetcode-cn.com/problems/permutations/
 */

export const permute = (nums) => {
  const result = []

  const path = []
  const used = []

  const travel = () => {
    if (path.length === nums.length) {
      result.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue
      }

      path.push(nums[i])
      used[i] = true

      travel()

      path.pop()
      used[i] = false
    }
  }

  travel()
  return result
}
