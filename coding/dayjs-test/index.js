import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'

dayjs.extend(quarterOfYear)
dayjs.extend(advancedFormat)

const makeMonth = (isLeaf, startDate = new Date(2021, 3)) => {
  const nextMonth = dayjs().add(1, 'month')
  const start = dayjs(startDate)

  const months = []
  let current = start
  while (current.isBefore(nextMonth, 'month')) {
    const formated = current.format('YYYY-MM')
    months.push({
      value: formated,
      label: formated,
      leaf: isLeaf && 'leaf',
    })
    current = current.add(1, 'month')
  }

  return months
}

const makeYear = (startDate = new Date(2021, 3)) => {
  const nextYear = dayjs().add(1, 'year')
  const start = dayjs(startDate)

  const years = []

  let current = start
  while (current.isBefore(nextYear, 'year')) {
    const formated = current.format('YYYY')
    years.push({
      value: formated,
      label: formated,
      leaf: 'leaf',
    })

    current = current.add(1, 'year')
  }

  return years
}

const makeQuarter = (startDate = new Date(2021, 3)) => {
  const nextQuarter = dayjs().add(1, 'Q')
  const start = dayjs(startDate)

  const quarters = []

  let current = start
  while (current.isBefore(nextQuarter, 'Q')) {
    const formated = current.format('YYYY-[Q]Q')
    quarters.push({
      value: formated,
      label: formated,
      leaf: 'leaf',
    })

    current = current.add(1, 'quarter')
  }

  return quarters
}

const makeDay = (startDate) => {
  const today = dayjs()
  const startDay = dayjs(startDate).startOf('month')

  const isSameMonth = startDay.isSame(today, 'month')

  const lastDay = isSameMonth ? today.add(1, 'day') : startDay.endOf('month').add(1, 'day')

  const days = []

  let current = startDay
  while (current.isBefore(lastDay, 'day')) {
    const formated = current.format('YYYY-MM-DD')
    days.push({
      value: formated,
      label: formated,
      leaf: 'leaf',
    })

    current = current.add(1, 'day')
  }

  return days
}
console.log(makeMonth())
console.log(makeYear())
console.log(makeQuarter())
console.log(makeDay('2022-12'), makeDay('2021-3'), makeDay())
