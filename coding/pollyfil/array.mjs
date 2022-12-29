/**
 *
 */

/**
 *
 * @param {*} callbackfn
 * @param {*} thisArg
 */
Array.prototype._forEach = function (callbackfn, thisArg = window) {
  const length = this.length

  for (let i = 0; i < length; i++) {
    callbackfn.call(thisArg, this[i], i, this)
  }
}

/**
 *
 * @param {*} predicate
 * @param {*} thisArg
 * @returns
 */
Array.prototype._filter = function (predicate, thisArg = window) {
  const newArr = []
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      newArr.push(this[i])
    }
  }

  return newArr
}

/**
 *
 * @param {*} predicate
 * @param {*} thisArg
 * @returns
 */
Array.prototype._find = function (predicate, thisArg = window) {
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return this[i]
    }
  }
}

/**
 *
 * @param {*} predicate
 * @param {*} thisArg
 * @returns
 */
Array.prototype._findIndex = function (predicate, thisArg = window) {
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return i
    }
  }

  return -1
}

/**
 *
 * @param {*} callbackfn
 * @param {*} thisArg
 * @returns
 */
Array.prototype._map = function (callbackfn, thisArg = window) {
  const mappedArr = []
  const length = this.length

  for (let i = 0; i < length; i++) {
    mappedArr.push(callbackfn.call(thisArg, this[i], i, this))
  }

  return mappedArr
}

/**
 *
 * @param {*} callbackfn
 * @param {*} initialValue
 * @returns
 */
Array.prototype._reduce = function (callbackfn, initialValue) {
  const length = this.length
  let startIndex = 0

  if (!initialValue) {
    initialValue = this[0]
    startIndex = 1
  }

  for (let i = startIndex; i < length; i++) {
    initialValue = callbackfn(initialValue, this[i], i, this)
  }

  return initialValue
}

/**
 *
 * @param {*} callbackfn
 * @param {*} initialValue
 * @returns
 */
Array.prototype._reduceRight = function (callbackfn, initialValue) {
  const length = this.length
  let startIndex = length - 1

  if (!initialValue) {
    initialValue = this[length - 1]
    startIndex = length - 2
  }

  for (let i = startIndex; i >= 0; i--) {
    initialValue = callbackfn(initialValue, this[i], i, this)
  }

  return initialValue
}

/**
 *
 * @param {*} predicate
 * @param {*} thisArg
 * @returns
 */
Array.prototype._every = function (predicate, thisArg = window) {
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (!predicate.call(thisArg, this[i], i, this)) {
      return false
    }
  }

  return true
}

/**
 *
 * @param {*} predicate
 * @param {*} thisArg
 * @returns
 */
Array.prototype._some = function (predicate, thisArg = window) {
  const length = this.length

  for (let i = 0; i < length; i++) {
    if (predicate.call(thisArg, this[i], i, this)) {
      return true
    }
  }

  return false
}

/**
 *
 * @param {*} searchElement
 * @param {*} fromIndex
 * @returns
 */
Array.prototype._includes = function (searchElement, fromIndex = 0) {
  const length = this.length

  for (let i = fromIndex; i < length; i++) {
    if (this[i] === searchElement) {
      return true
    }
  }

  return false
}

/**
 *
 * @param {*} depth
 * @returns
 */
Array.prototype._flat = function (depth = 1) {
  return this.reduce((previousValue, currentValue) => {
    return previousValue.concat(Array.isArray(currentValue) && depth > 0 ? currentValue._flat(depth - 1) : currentValue)
  })
}

/**
 *
 * @param {*} callbackfn
 * @param {*} thisArg
 * @returns
 */
Array.prototype._flatMap = function (callbackfn, thisArg = global) {
  return this.map(callbackfn, thisArg)._flat()
}

Array.prototype._entries = function* () {
  const length = this.length

  for (let i = 0; i < length; i++) {
    yield [i, this[i]]
  }
}

/**
 *
 * @param {*} arg
 * @returns
 */
Array._isArray = function (arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

Array._of = function () {
  return [].slice.call(arguments)
}
