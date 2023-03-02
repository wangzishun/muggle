/**
 * 按位相加进位
 */
const addV1 = (a, b) => {
  const lenA = a.length
  const lenB = b.length

  if (lenA === 0) return b
  if (lenB === 0) return a

  // 有可能会有进位，所以长度 + 1
  const maxLen = Math.max(lenA, lenB) + 1

  a = a.padStart(maxLen, '0')
  b = b.padStart(maxLen, '0')

  const temp = Array(maxLen).fill(0) // 使用数组存储， 字符串拼接会导致性能下降

  let pos = maxLen - 1

  while (pos >= 0) {
    const sum = (+a[pos] || 0) + (+b[pos] || 0) + temp[pos]

    temp[pos] = sum % 10
    temp[pos - 1] = Math.floor(sum / 10) // 进位

    pos--
  }

  let start = 0
  while (temp[start] === 0) {
    start++
  }
  temp.splice(0, start) // 去除前置0

  if (temp.length === 0) return '0'
  return temp.join('')
}

const limit = 10 ** 15 - 1

/**
 * 15位切割，分别相加
 */
const addV2 = (a, b) => {
  const lenA = a.length
  const lenB = b.length

  if (lenA === 0) return b
  if (lenB === 0) return a

  const maxLen = Math.max(lenA, lenB)

  a = a.padStart(maxLen, '0') // 对齐
  b = b.padStart(maxLen, '0')

  // 15位切割，分别相加
  // const arrA = a.match(/\d{1,15}/g)
  // const arrB = b.match(/\d{1,15}/g)
  const arrA = []
  const arrB = []

  // 从后往前，每次取15位
  for (let i = maxLen - 1; i > 0; i--) {
    let step = 1
    while (step < 14 && a[i - step]) {
      step++
    }

    const start = i - step > 0 ? i - step : 0
    arrA.push(a.slice(start, i + 1)) // push 15 位
    arrB.push(b.slice(start, i + 1))
    i -= step
  }

  // 按push顺序，相加并记录进位
  const result = arrA.reduce(
    (pre, _, index) => {
      let sum = parseInt(arrA[index]) + parseInt(arrB[index]) + pre[1]

      // sum = sum.toString()

      let carry = 0
      if (sum > limit) {
        carry = parseInt(sum[0])
        sum = Math.floor(sum / 10)
      }

      pre[0] = sum + pre[0]
      pre[1] = carry

      return pre
    },
    ['', 0]
  )

  return result[1] ? result[1] + result[0] : result[0]
}

const num1 = '12345678901234567890123456789098' // 32位
const num2 = '98765432109876543210987654321098' // 32位

const result = '111111111011111111101111111110196'

console.time('addV1')
const res1 = addV1(num1, num2)
console.timeEnd('addV1')

console.time('addV2')
const res2 = addV2(num1, num2)
console.timeEnd('addV2')

console.time('bigint')
const bigint = BigInt(num1) + BigInt(num2) // 2111111111011111111101111111110196n
console.timeEnd('bigint')

console.log(res1 === result, res2 === result, bigint)
