export const esSimpleInherit = function (target, origin) {
  target.prototype = Object.create(origin.prototype, {
    constructor: {
      value: target,
      enumeable: false,
      writable: true,
      configurable: true
    }
  })

  Object.setPrototypeOf(target, origin)
}

/**
 * 测试
 */
import assert from 'node:assert'
import { test, describe, it } from 'node:test'

describe('esSimpleInherit 1', () => {
  const OriCtor = function (name = 'OriCtor') {
    this.name = name
    this.ori = 'ori'
  }
  OriCtor.prototype.sayName = function () {
    console.log('function from ori prototype', this.name)
    return this.name
  }

  OriCtor.staticName = 'ori'

  const TarCtor = function (name = 'TarCtor') {
    OriCtor.apply(this, arguments)
    this.name = name
  }

  esSimpleInherit(TarCtor, OriCtor)

  const tar = new TarCtor()

  it(() => {
    assert.equal(tar.name, 'TarCtor')
    assert.equal(tar.ori, 'ori')
    assert.equal(tar.sayName, OriCtor.prototype.sayName)
    assert.equal(TarCtor.staticName, OriCtor.staticName)

    assert.equal(tar.sayName(), 'TarCtor')

    assert.equal(tar.constructor, TarCtor)
    assert.equal(TarCtor.__proto__, OriCtor)
  })

  it(() => {
    assert.equal(tar instanceof OriCtor, true)

    assert.equal(TarCtor.prototype.__proto__, OriCtor.prototype)
    assert.equal(OriCtor.prototype.__proto__, Object.prototype)

    assert.equal(tar instanceof TarCtor, true)
    assert.equal(tar.__proto__, TarCtor.prototype)
    assert.equal(tar.__proto__.__proto__, OriCtor.prototype)
    assert.equal(tar.__proto__.__proto__.__proto__, Object.prototype)
  })
})

describe('esSimpleInherit 2', () => {
  class OriCtor {
    constructor(name = 'OriCtor') {
      console.log('OriCtor constructor')
      this.name = name
      this.ori = 'ori'
    }

    sayName() {
      console.log('function from ori prototype', this.name)
      return this.name
    }

    static staticName = 'ori'
  }

  class TarCtor extends OriCtor {
    constructor(name = 'TarCtor') {
      super(name)
      this.name = name
    }
  }

  const tar = new TarCtor()

  it(() => {
    assert.equal(tar.name, 'TarCtor')
    assert.equal(tar.ori, 'ori')
    assert.equal(tar.sayName, OriCtor.prototype.sayName)
    assert.equal(TarCtor.staticName, OriCtor.staticName)

    assert.equal(tar.sayName(), 'TarCtor')

    assert.equal(tar.constructor, TarCtor)
    assert.equal(TarCtor.__proto__, OriCtor)
  })

  it(() => {
    assert.equal(tar instanceof OriCtor, true)

    assert.equal(TarCtor.prototype.__proto__, OriCtor.prototype)
    assert.equal(OriCtor.prototype.__proto__, Object.prototype)

    assert.equal(tar instanceof TarCtor, true)
    assert.equal(tar.__proto__, TarCtor.prototype)
    assert.equal(tar.__proto__.__proto__, OriCtor.prototype)
    assert.equal(tar.__proto__.__proto__.__proto__, Object.prototype)
  })
})
