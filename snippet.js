const to = (str) => {
  // const list = str.split('.').reverse()

  // let current = null

  // list.forEach((key) => {
  //   const obj = { [key]: current }
  //   current = obj
  // })

  // return current

  return str.split('.').reduceRight((prev, curr) => {
    return { [curr]: prev }
  }, null)
}

console.log(to('a.b.c'))

const _instanceof = (left, right) => {
  let proto = Object.getPrototypeOf(left)

  while (1) {
    if (proto === null) {
      return false
    }

    if (proto === right.prototype) {
      return true
    }

    proto = Object.getPrototypeOf(proto)
  }
}
