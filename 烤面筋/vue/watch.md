# Watch

watch 的实现本质是就是利用了 effect 以及 options.scheduler 选项。在 watch 内部的 effect 中调用 traverse 函数进行递归读取操作，这样就能读取一个对象上的任意属性，从而当任意属性发生变化时都能触发回调函数执行。

watch 函数除了可以观测响应式数据，还可以接收一个 getter 函数。可以指定 watch 依赖哪些响应式数据，只有当这些数据变化时，才会触发回调函数执行.

利用 effect 函数的 lazy ，获取新值与旧值. 手动调用 effectFn 函数得到的返回值就是旧值，即第一次执行得到得知。当变化发生并处罚 scheduler 调度函数执行时，会重新调用 effectFn 函数并得到新值，这样我们就可以拿到旧值与新值，接着把它们作为参数传递给回调函数就可以了。

```js
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return

  seen.add(value)

  // 假设 value 是一个对象，不考虑数组等其他结构
  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}

function watch(source, cb) {
  let getter

  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      newValue = effectFn()
      cb(newValue, oldValue)
      oldValue = newValue
    },
  })

  oldValue = effectFn()
}
```
