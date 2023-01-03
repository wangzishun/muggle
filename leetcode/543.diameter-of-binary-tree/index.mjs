/**
 * @description 543. 二叉树的直径
 * @see https://leetcode.cn/problems/diameter-of-binary-tree/
 */

export const diameterOfBinaryTree = (root) => {
  let max = 0
  const dfs = (node) => {
    if (!node) return 0

    const leftDepth = dfs(node.left)
    const rightDepth = dfs(node.right)

    if (leftDepth + rightDepth > max) {
      max = leftDepth + rightDepth
    }

    return Math.max(leftDepth, rightDepth) + 1
  }

  dfs(root)

  return max
}
