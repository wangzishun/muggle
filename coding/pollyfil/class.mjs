export const _extend = function (target, origin) {
  target.prototype = Object.create(origin.prototype, {
    constructor: {
      value: target,
      enumeable: false,
      writable: true,
      configurable: true,
    },
  })

  Object.setPrototypeOf(target, origin)
}
