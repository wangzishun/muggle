/**
 * 123456 十二万三千四百五十六
 * @param {*} number
 */
export const _number2Chinese = (number) => {
  const dictinary = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']

  const numberString = String(number)

  const stack = []
  let unitPos = 0
  let previousChar = NaN
  for (let i = numberString.length - 1; i >= 0; i--) {
    const char = numberString[i]

    let chinese = dictinary[char]
    let unit = units[unitPos++]

    // 零后面不需要单位
    if (char === '0') {
      unit = ''
      // 两个连续的零，只显示一个
      if (previousChar === '0') {
        // chinese = ''
        continue
      }
    } else if (char === '1' && unit === '十' && i === 0) {
      // 对于 10, 100000, 1000000000 这种情况，不需要显示 1，即 十，十万，十亿，否则会出现 一十，一十万，一十亿
      chinese = ''
    }

    previousChar = char

    stack.push(`${chinese}${unit}`)
  }

  // 末尾的零不需要
  if (stack[0] === dictinary[0]) {
    stack.shift()
  }

  return stack.reverse().join('')
}

/**
 * 一千二百三十四万五千六百七十 12345670
 * @param {*} chinese
 * @returns
 */
export const _chinese2Number = (chinese) => {
  const dictinary = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
    百: 100,
    千: 1000,
    万: 10000,
    亿: 100000000,
  }

  const stack = []
  let section = 0
  let previousNum = 1

  const len = chinese.length
  for (let i = 0; i < len; i++) {
    const char = chinese[i]
    const num = dictinary[char]

    if (num < 10) {
      previousNum = num
    } else if (num >= 10 && num <= 1000) {
      section += previousNum * num
      previousNum = 0
    } else {
      // num >= 10000
      stack.push((section + previousNum) * num)
      section = 0
      previousNum = 0
    }

    if (i === len - 1) {
      stack.push(section)

      if (num < 10) {
        stack.push(num)
      }
    }
  }

  return stack.reduce((acc, cur) => acc + cur)
}
