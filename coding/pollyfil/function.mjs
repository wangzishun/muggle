function _new(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw '_new(xxx) function is not a constructor'
  }

  _new.target = ctor

  const obj = Object.create(ctor.prototype)

  const result = ctor.apply(obj, args)

  return result instanceof Object ? result : obj
}

/**
 *
 * @param {*} context
 * @returns
 */
Function.prototype._bind = function (context) {
  const self = this

  const args = Array.prototype.slice.call(arguments, 1)

  const Bound = function () {
    const args2 = Array.prototype.slice.call(arguments)

    const ctx = this instanceof Bound ? this : context

    self.apply(ctx, args.concat(args2))
  }

  Bound.prototype = Object.create(self.prototype, {
    constructor: {
      value: Bound,
    },
  })

  return Bound
}
