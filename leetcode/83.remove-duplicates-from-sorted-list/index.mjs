/**
 * @description 83. 删除排序链表中的重复元素
 * @see https://leetcode.cn/problems/remove-duplicates-from-sorted-list/
 */

import { ListNode } from '../../shared/data-structure.mjs'

export const deleteDuplicatesV1 = (head) => {
  if (!head) return null
  let pos = head

  while (pos.next) {
    if (pos.val === pos.next.val) {
      pos.next = pos.next.next
    } else {
      pos = pos.next
    }
  }
  return head
}

export const deleteDuplicatesV2 = (head) => {
  const dummy = new ListNode(undefined, head)

  let slow = dummy
  let fast = dummy.next

  while (fast) {
    if (fast.val !== slow.val) {
      slow.next = fast
      slow = fast
    }

    fast = fast.next
  }

  slow.next = null

  return dummy.next
}
