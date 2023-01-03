/**
 * @description 144. 二叉树的前序遍历
 * @see https://leetcode.cn/problems/binary-tree-preorder-traversal/
 */

export const preorderTraversalDfs = (root) => {
  const dfs = (node, result) => {
    if (!node) return result

    result.push(node.val)
    dfs(node.left, result)
    dfs(node.right, result)

    return result
  }

  return dfs(root, [])
}

export const preorderTraversalBfs = (root) => {
  if (!root) return []

  const result = []
  const stack = [root]

  while (stack.length) {
    const node = stack.shift()

    result.push(node.val)
    if (node.right) stack.unshift(node.right)
    if (node.left) stack.unshift(node.left)
  }
  return result
}
