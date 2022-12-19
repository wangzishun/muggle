/**
 * 结构化克隆算法
 */
const deepCloneMessageChannel = (obj) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj)
  }
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel()

    port1.addEventListener('message', (event) => {
      resolve(event.data)
    })

    port2.postMessage(obj)
  })
}

/**
 * null undefined 直接返回
 *
 * function 不进行深拷贝，难以处理，没啥应用场景
 *
 * symbol 特殊处理 Symbol(obj.description)
 * typeof !== object 的 string number boolean bigint 直接返回
 *
 *
 * 接下来是引用类型，WeakMap 用于解决循环引用的问题
 *
 * Boolean Number String Date Error 的实例特殊处理 new obj.constructor(obj)
 * RegExp 特殊处理 new RegExp(obj, obj.flags)
 * Set 特殊处理 new Set(Array.from(obj).map((item) => cloneDeepManual(item, map)))
 * Map 特殊处理 new Map(Array.from(obj).map(([key, value]) => [key, cloneDeepManual(value, map)]))
 * 如果是经过特殊处理的对象，防止丢失属性，需要使用属性描述符补全 defineProperties + getOwnPropertyDescriptors
 *
 * 如果是普通对象，使用 Object.create + getPrototypeOf + getOwnPropertyDescriptors 创建新对象
 *
 * WeakMap 用于解决循环引用的问题
 *
 * Reflect.ownKeys(obj) 遍历对象的所有属性key，包括 Symbol 和 不可枚举的属性
 *
 */
const cloneDeepManual = (obj, map = new WeakMap()) => {
  if (!obj) return obj // null undefined

  const type = typeof obj

  if (type === 'function') return obj // function 不进行深拷贝

  if (type === 'symbol') return Symbol(obj.description) // symbol 特殊处理

  if (type !== 'object') return obj // string number boolean bigint

  if (map.get(obj)) return map.get(obj)

  let cloneObj

  if (['Boolean', 'Number', 'String', 'Date', 'Error'].includes(Object.prototype.toString.call(obj).slice(8, -1))) {
    cloneObj = new obj.constructor(obj) // boolean number string date error 特殊处理
  } else if (obj instanceof RegExp) {
    cloneObj = new RegExp(obj, obj.flags) // regexp 特殊处理
  } else if (obj instanceof Set) {
    cloneObj = new Set(Array.from(obj).map((item) => cloneDeepManual(item, map))) // set 特殊处理
  } else if (obj instanceof Map) {
    cloneObj = new Map(Array.from(obj).map(([key, value]) => [cloneDeepManual(key, map), cloneDeepManual(value, map)])) // map 特殊处理
  }

  const descriptors = Object.getOwnPropertyDescriptors(obj)

  if (cloneObj) {
    Object.defineProperties(cloneObj, descriptors) // 补全有可能丢失的属性, 例如 var d = new Date(); d.name = 'wangzishun'
  } else {
    const prototype = Object.getPrototypeOf(obj)
    cloneObj = Object.create(prototype, descriptors) // 根据原型和属性描述符创建新对象
  }

  map.set(obj, cloneObj)

  Reflect.ownKeys(cloneObj).forEach((key) => {
    if (descriptors[key].enumerable === false && 'value' in descriptors[key]) {
      // 不可枚举的属性，使用 defineProperty 重新定义
      Object.defineProperty(cloneObj, key, {
        ...descriptors[key],
        value: cloneDeepManual(obj[key], map)
      })
    } else if (typeof key === 'symbol') {
      // symbol 属性
      delete cloneObj[key]
      cloneObj[Symbol(key.description)] = cloneDeepManual(obj[key], map)
    } else {
      cloneObj[key] = cloneDeepManual(cloneObj[key], map)
    }
  })

  return cloneObj
}

const symbol = Symbol('hello')

const ref = { hallo: 'wangzishun' }
const number = new Number(1)
const arr = [0, 1, 2, ref]
const date = new Date(100)
const reg = new RegExp('/wangzishun/ig')
const error = new Error('error')

const map = new Map([[1, ref]])
const set = new Set([1, 2, ref])
const weakmap = new WeakMap([[ref, 2]])
const weakset = new WeakSet([[ref]])

date.hallo = ref
reg.hallo = ref
error.hallo = ref
let obj = {
  age: 27,
  number,
  name: 'wangzishun',
  boolean: true,
  empty: undefined,
  nul: null,
  ref,
  arr,
  func() {
    console.log(ref, this)
  },
  date,
  reg,
  [symbol]: ref,
  error,
  map,
  set,
  weakmap,
  weakset,
  // node: document.createElement('div'),
  loop: {}
}

obj.loop = obj // 设置loop成循环引用的属性

// 定义不可枚举属性
Object.defineProperty(obj, 'innumerable', {
  enumerable: false,
  value: '不可枚举属性'
})

const cloneObj = cloneDeepManual(obj)

console.log('length', Reflect.ownKeys(obj).length, Reflect.ownKeys(cloneObj).length)
console.log('number', obj.number === cloneObj.number)
console.log('arr', obj.arr === cloneObj.arr)
console.log('ref', obj.ref === cloneObj.ref)
console.log('func', obj.func === cloneObj.func)
console.log('date', obj.date === cloneObj.date)
console.log('reg', obj.reg === cloneObj.reg)
console.log('symbol', obj[symbol] === cloneObj[symbol])
console.log('loop', obj.loop === cloneObj.loop)
// console.log('node', obj.node === cloneObj.node)
console.log('error', obj.error === cloneObj.error)
console.log('map', obj.map === cloneObj.map)
console.log('set', obj.set === cloneObj.set)
console.log('weakMap', obj.weakMap === cloneObj.weakMap)
// console.log('weakSet', obj.weakSet === cloneObj.weakSet)
