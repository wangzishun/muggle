function isPlaneObject(value) {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function immer(state, thunk) {
  const proxies = new Map()

  const copies = new Map()

  const traps = {
    get(target, key) {
      return createProxy(getCurrentSource(target[key]))
    },
    has(target, key) {
      return key in getCurrentSource(target)
    },
    ownKeys(target) {
      return Reflect.ownKeys(getCurrentSource(target))
    },
    set(target, key, value) {
      const current = createProxy(getCurrentSource(target)[key])
      const newValue = createProxy(value)

      if (current !== newValue) {
        const copy = getOrCreateCopy(target)
        copy[key] = newValue
      }

      return true
    },
    deleteProperty(target, key) {
      const copy = getOrCreateCopy(target)
      delete copy[key]
      return true
    },
  }

  function createProxy(base) {
    if (isPlaneObject(base) || Array.isArray(base)) {
      if (proxies.has(base)) return proxies.get(base)
      const proxy = new Proxy(base, traps)

      proxies.set(base, proxy)
      return proxy
    }

    return base
  }

  function getOrCreateCopy(base) {
    if (copies.has(base)) return copies.get(base)

    const copy = Array.isArray(base) ? [...base] : { ...base }
    copies.set(base, copy)
    return copy
  }

  function getCurrentSource(base) {
    return copies.get(base) || base
  }

  function hasChanges(base) {
    const proxy = proxies.get(base)
    if (!proxy) return false

    if (copies.has(base)) return true

    for (let key of Object.keys(base)) {
      if (hasChanges(base[key])) return true
    }

    return false
  }

  function finalize(base) {
    if (!hasChanges(base)) return base

    const copy = getOrCreateCopy(base)

    if (isPlaneObject(base)) {
      Object.keys(copy).forEach((key) => (copy[key] = finalize(copy[key])))
    } else if (Array.isArray(base)) {
      copy.forEach((value, index) => (copy[index] = finalize(copy[index])))
    }

    return copy
  }

  const draft = createProxy(state)

  thunk(draft)

  return finalize(state)
}

const state = {
  phone: '1-770-736-8031 x56442',
  website: { site: 'hildegard.org' }, // 注意这里为了方便测试状态共享，将简单数据类型改成了对象
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets',
    nested: {
      hallo: 'world',
    },
  },
}

const copy = immer(state, (draft) => {
  draft.company.name = 'google'
  draft.company.nested.name = 'wangzi'
})

console.log(copy.company.name) // 'google'
console.log(copy.company.nested.name) // 'google'
console.log(copy.website === state.website) // true

console.log(JSON.stringify(copy, null, 2))
