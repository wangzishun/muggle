const numberTransferChinese = (number) => {
  const dictinary = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千']

  const result = []

  const numberStr = number.toString()
  const len = numberStr.length
  let unitPos = 0
  let previousChar = NaN

  for (let i = len - 1; i >= 0; i--) {
    const char = numberStr[i]
    let unit = units[unitPos++]
    let ch = dictinary[char]

    if (char === '0' && previousChar === '0') {
      unit = ''
      ch = ''
    } else if (char === '1' && unit === '十' && i === 0) {
      ch = ''
    }

    previousChar = char

    result.push(`${ch}${unit}`)
  }

  if (result[0] === dictinary[0]) {
    result.shift()
  }

  return result.reverse().join('')
}

console.log(numberTransferChinese(1234)) //  一千二百三十四
console.log(numberTransferChinese(123456)) // 十二万三千四百五十六
console.log(numberTransferChinese(12345670)) //  一千二百三十四万五千六百七十
console.log(numberTransferChinese(100010001)) // 一亿零一万零一
console.log(numberTransferChinese(1100010001)) //  一百零一亿零一万零一

const chineseToNumber = (chinese) => {
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
    兆: 1000000000000
  }

  const stack = []
  const len = chinese.length
  let section = 0
  let previousNum = 1

  for (let i = 0; i < len; i++) {
    const char = chinese[i]
    const num = dictinary[char]

    if (num < 10) {
      previousNum = num
    } else if (num >= 10 && num <= 1000) {
      section += previousNum * num
      previousNum = 0
    } else if (num >= 10000) {
      stack.push((section + previousNum) * num)
      section = 0
      previousNum = 0
    }

    if (i === len - 1) {
      stack.push(section)

      if (num < 10) {
        stack.push(previousNum)
      }
    }
  }

  return stack.reduce((acc, cur) => acc + cur, 0)
}

console.log(chineseToNumber('一千二百三十四')) // 1234
console.log(chineseToNumber('十二万三千四百五十六')) // 123456
console.log(chineseToNumber('一千二百三十四万五千六百七十')) // 12345670
console.log(chineseToNumber('一亿零一万零一')) // 100010001
console.log(chineseToNumber('一百零一亿零一万零一')) // 10100010001
console.log(chineseToNumber('十一兆零一千亿一千万一千零一')) // 11000000100010001
console.log(chineseToNumber('十一兆')) // 11000000000000000
