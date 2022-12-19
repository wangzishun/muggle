/**
 * 实现建议的 mvvm
 */

// 给定一个未排序的整数数组，找出最长连续序列的长度。
// 示例:
// 输入: [100, 4, 200, 1, 3, 2]
// 输出: 4
// 解释: 最长连续序列是 [1, 2, 3, 4]。它的长度为 4。
const longestConsecutive = function (nums) {
  const arr = nums.slice().sort((a, b) => a - b)

  const len = arr.length

  let max = 1
  let count = 1

  for (let i = 1; i < len; i++) {
    if (arr[i] - arr[i - 1] === 1) {
      count++
    } else {
      max = Math.max(max, count)
      count = 0
    }
  }

  return max
}

console.log('longestConsecutive', longestConsecutive([100, 4, 200, 1, 3, 2]))

const template = (str) => {
  return (data) => {
    return str.replace(/{{\s*(.=?)\s*}}/g, (match, key) => {
      return data[key]
    })
  }
}

const tpl = template('<p>hey there {{ name }} {{ name }}</p>')
console.log(tpl({ name: 'world' }))
