function immer(state, thunk) {
  const copies = new Map()

  const traps = {
    get(target, key) {
      return createProxy(target[key])
    },
    set(target, key, value) {
      const copy = { ...target }
      copy[key] = value

      copies.set(target, copy)
      return true
    },
  }

  function createProxy(target) {
    return new Proxy(target, traps)
  }

  function finalize(state) {
    const result = { ...state }

    Object.keys(state).forEach((key) => {
      const copy = copies.get(state[key])

      if (copy) {
        result[key] = finalize(copy)
      } else {
        result[key] = state[key]
      }
    })

    return result
  }

  const clone = createProxy(state)

  thunk(clone)

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
