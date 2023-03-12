// node 18
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

function getMaxArea(arr, r, c) {
  let row = arr.length
  let col = arr[0].length

  let leftTop = [r, c]
  let rightBottom = [r, c]

  const outOfRange = (r, c) => r < 0 || r >= row || c < 0 || c >= col || !arr[r][c]

  function dfs(startRow, startCol) {
    if (outOfRange(startRow, startCol)) return

    // 之后就不再找咯
    arr[startRow][startCol] = ''

    // 替换一下左上角和右下角的范围
    if (startRow < leftTop[0]) leftTop[0] = startRow
    if (startCol < leftTop[1]) leftTop[1] = startCol

    if (startRow > rightBottom[0]) rightBottom[0] = startRow
    if (startCol > rightBottom[1]) rightBottom[1] = startCol

    // 四海八荒查找
    dfs(startRow - 1, startCol) // 上
    dfs(startRow + 1, startCol) // 下
    dfs(startRow, startCol - 1) // 左
    dfs(startRow, startCol + 1) // 右
    dfs(startRow - 1, startCol - 1) // 左上
    dfs(startRow - 1, startCol + 1) // 右上
    dfs(startRow + 1, startCol - 1) // 左下
    dfs(startRow + 1, startCol + 1) // 右下
  }

  dfs(r, c)

  return [leftTop, rightBottom]
}

test(() => {
  const answer = [
    [0, 0],
    [3, 2],
  ]
  const result = getMaxArea(
    [
      ['', '', '2', ''],
      ['1', '1', '', ''],
      ['', '3', '', ''],
      ['', '1', '', ''],
    ],
    1,
    1,
  )
  console.log(JSON.stringify(result))
  assert.deepEqual(result, answer)
})
