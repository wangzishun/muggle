const zeroCharCode = '0'.charCodeAt()
const nineCharCode = '9'.charCodeAt()
const ACharCode = 'A'.charCodeAt() - 10

/**
 * 返回解析后的十进制
 * @param {*} str 要解析的字符串
 * @param {*} radix 解析时使用的基数，该值介于 2 ~ 36 之间
 */
export function _parseInt(str, radix) {
  if (typeof str !== 'string') {
    str = String(str).trim()
  }

  if (radix && (radix < 2 || radix > 36)) {
    return NaN
  } else if (!radix) {
    radix = 10
  }

  const regexp = /^([+|-]?)([0-9a-zA-Z]+)/

  if (!regexp.test(str)) {
    return NaN
  }

  const [, sign, numStr] = str.match(regexp)

  const numStrSplited = numStr.split('')
  const nums = []

  for (let i = 0; i < numStrSplited.length; i++) {
    const code = numStrSplited[i].toUpperCase().charCodeAt()
    let num = 0

    if (code >= zeroCharCode && code <= nineCharCode) {
      num = code - zeroCharCode
    } else {
      num = code - ACharCode
    }

    if (num >= radix) {
      break
    }

    nums.push(num)
  }

  if (nums.length === 0) {
    return NaN
  }

  const res = nums.reduce((acc, cur) => {
    return acc * radix + cur
  }, 0)

  return res * (sign === '-' ? -1 : 1)
}
