/**
 * @description 104. 二叉树的最大深度
 * @see https://leetcode.cn/problems/maximum-depth-of-binary-tree/
 */

export const maxDepthDfs = (root) => {
  if (!root) return 0

  const leftDepth = maxDepthDfs(root.left)
  const rightDepth = maxDepthDfs(root.right)

  return Math.max(leftDepth, rightDepth) + 1
}

export const maxDepthBfs = (root) => {
  if (!root) return 0

  const stack = [root]
  let depth = 0

  while (stack.length) {
    depth++

    const size = stack.length
    for (let i = 0; i < size; i++) {
      const node = stack.shift()
      if (node.left) stack.push(node.left)
      if (node.right) stack.push(node.right)
    }
  }

  return depth
}
