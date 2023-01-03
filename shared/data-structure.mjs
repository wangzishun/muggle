export function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

ListNode.fromArray = (arr) => {
  if (!arr.length) return null

  const dummy = new ListNode()

  for (let item of arr) {
    dummy.next = new ListNode(item)
  }

  return dummy.next
}

ListNode.toArray = (head) => {
  const arr = []
  while (head) {
    arr.push(head.val)
    head = head.next
  }

  return arr
}

export function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val
  this.left = left === undefined ? null : left
  this.right = right === undefined ? null : right
}

TreeNode.fromArray = (arr) => {
  if (!arr.length) return null

  const root = new TreeNode(arr.shift())
  const stack = [root]

  while (arr.length) {
    const node = stack.shift()
    const left = arr.shift()
    const right = arr.shift()

    if (left) {
      node.left = new TreeNode(left)
      stack.push(node.left)
    }

    if (right) {
      node.right = new TreeNode(right)
      stack.push(node.right)
    }
  }

  return root
}
