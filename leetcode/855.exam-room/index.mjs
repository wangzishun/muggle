/**
 * @description 855. 考场就座
 * @see https://leetcode-cn.com/problems/exam-room/
 */

/**
 * @param {number} n
 */
export const ExamRoom = function (n) {
  this.size = n - 1

  this.students = []
}

/**
 * @return {number}
 */
ExamRoom.prototype.seat = function () {
  const numberOfStudents = this.students.length

  if (numberOfStudents === 0) {
    this.students[0] = 0
    return 0
  }

  const firstSeatDistance = this.students[0]
  const lastSeatDistance = this.size - this.students[numberOfStudents - 1]

  let seat = 0
  let maxDistance = firstSeatDistance

  for (let i = 1; i < numberOfStudents; i++) {
    const previouse = this.students[i - 1]
    const current = this.students[i]

    const distance = (current - previouse) >> 1

    if (distance > maxDistance) {
      maxDistance = distance
      seat = previouse + distance
    }
  }

  if (lastSeatDistance > maxDistance) {
    seat = this.size
  }

  this.students.push(seat)
  this.students.sort((a, b) => a - b)

  return seat
}

/**
 * @param {number} p
 * @return {void}
 */
ExamRoom.prototype.leave = function (p) {
  this.students.splice(this.students.indexOf(p), 1)
  return null
}

/**
 * Your ExamRoom object will be instantiated and called as such:
 * var obj = new ExamRoom(n)
 * var param_1 = obj.seat()
 * obj.leave(p)
 */

const examRoom = new ExamRoom(10)
console.log(examRoom.seat())
console.log(examRoom.seat())
console.log(examRoom.seat())
console.log(examRoom.seat())
console.log(examRoom.leave(4))
console.log(examRoom.seat())

// ["ExamRoom","seat","seat","seat","seat","leave","seat"]
// [[10],[],[],[],[],[4],[]]

// [null,0,9,4,2,null,5]
