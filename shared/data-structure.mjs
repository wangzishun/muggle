export function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

ListNode.fromArray = (arr) => {
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
