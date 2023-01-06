import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

/**
 * @description 257.binary-tree-paths 二叉树的所有路径
 * @see https://leetcode-cn.com/problems/binary-tree-paths/
 */

export const binaryTreePathsV1 = (root) => {
  const result = []
  const path = []

  const travel = (node) => {
    if (!node) return

    path.push(node.val)

    if (!node.left && !node.right) {
      result.push(path.join('->'))
    }

    if (node.left) {
      travel(node.left)
    }

    if (node.right) {
      travel(node.right)
    }

    path.pop()
  }

  travel(root)

  return result
}

export const binaryTreePathsV2 = (root) => {
  const result = []
  const travel = (node, path) => {
    if (!node) return

    path += node.val.toString()
    if (!node.left && !node.right) {
      result.push(path)
    } else {
      path += '->'

      travel(node.left, path)
      travel(node.right, path)
    }
  }

  travel(root, '')
  return result
}
