import { ListNode, TreeNode } from '../../shared/data-structure.mjs'

/**
 * @description 51.n-queens N 皇后
 * @see https://leetcode-cn.com/problems/n-queens/
 */

export const solveNQueens = (n) => {
  const board = Array(n)
    .fill()
    .map(() => Array(n).fill('.'))

  const result = []

  const travel = (row) => {
    if (row === n) {
      result.push(board.map((row) => row.join('')))
      return
    }
    for (let col = 0; col < n; col++) {
      if (invalid(board, row, col)) continue

      board[row][col] = 'Q'
      travel(row + 1)
      board[row][col] = '.'
    }
  }

  travel(0)

  return result
}

const invalid = (board, row, col) => {
  for (let y = row - 1; y >= 0; y--) {
    if (board[y][col] === 'Q') return true
  }

  for (let x = col - 1, y = row - 1; x >= 0 && y >= 0; x--, y--) {
    if (board[y][x] === 'Q') return true
  }

  for (let x = col + 1, y = row - 1; x < board.length && y >= 0; x++, y--) {
    if (board[y][x] === 'Q') return true
  }

  return false
}
