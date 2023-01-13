const personList = `First_Name: John, Last_Name: Doe
First_Name: Jane, Last_Name: Smith`

const regexpNames = /First_Name: (?<firstname>\w+), Last_Name: (?<lastname>\w+)/gm

console.log(personList.matchAll(regexpNames))
// for (const match of personList.matchAll(regexpNames)) {
//   console.log(`Hello ${match.groups.firstname} ${match.groups.lastname}`)
// }

const times = 100000

console.time('Array.from')
for (let index = 0; index < times; index++) {
  const a = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
}
console.timeEnd('Array.from')
console.time('Spread')
for (let index = 0; index < times; index++) {
  const a = [...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
}
console.timeEnd('Spread')

console.time('Spread')
for (let index = 0; index < times; index++) {
  const a = [...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
}
console.timeEnd('Spread')

console.time('Array.from')
for (let index = 0; index < times; index++) {
  const a = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
}
console.timeEnd('Array.from')
