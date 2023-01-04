const num2Str = (num) => (num > 9 ? `${num}` : `0${num}`)

const calcMonths = ({ isLeaf, month, startMonth, startYear }) => {
  return Array.from({ length: month - startMonth + 1 }).map((val, index) => ({
    value: `${startYear}-${num2Str(startMonth + index)}`,
    label: `${startYear}-${num2Str(startMonth + index)}`,
    leaf: isLeaf && 'leaf',
  }))
}

/**
 * @desc 默认是20210401开始，保留原有逻辑，兼容外部传入开始时间
 *
 * @param isLeaf
 * @param startDate
 * @returns
 */
function makeMonth(isLeaf = false, startDate = new Date(2021, 3)) {
  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const freezeStartYear = startDate.getFullYear()
  const freezeStartMonth = startDate.getMonth() + 1
  let startYear = startDate.getFullYear()
  let startMonth = startDate.getMonth() + 1
  let months = []
  let currentMonths = []

  while (year >= startYear) {
    if (startYear === freezeStartYear && year === freezeStartYear) {
      startMonth = freezeStartMonth
      currentMonths = calcMonths({ isLeaf, month, startMonth, startYear })
    } else if (startYear === freezeStartYear && year !== freezeStartYear) {
      startMonth = freezeStartMonth
      currentMonths = calcMonths({ isLeaf, month: 12, startMonth, startYear })
    } else {
      startMonth = 1
      currentMonths = calcMonths({ isLeaf, month, startMonth, startYear })
    }
    months = months.concat(currentMonths)
    startYear++
  }

  return months
}

const month = makeMonth(true)
console.log(month)
