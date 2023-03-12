# computed

新增两个变量 value 和 dirty，value 用来缓存值，dirty 用于标识是否需要重新计算，只会 dirty 为 true 的时候才会调用 effectFn 重新取值。同时增加 scheduler 调度器函数，它会在 getter 函数中所依赖的响应式数据变化时执行，将 dirty 设置为 true。

当读取一个计算属性的 value 值时，我们可以手动调用 track 函数，把计算属性返回的对象 obj 作为 target，同时作为第一个参数传递给 track 函数。当计算属性所依赖的响应式数据发生变化时，会执行调度器函数，在调度器函数内部手动调用 trigger 函数触发响应即可。

```js
function computed(getter) {
  // 缓存上一次的值
  let value
  // 标识是否需要重新计算值，true 意味要重新计算
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    // 添加调度器，调度器中重置 dirty
    scheduler() {
      dirty = true
      // 计算属性依赖的响应式数据发生变化时，手动调用 trigger 函数触发响应
      trigger(obj, 'value')
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 读取 value 时，手动调用 track 函数进行追踪
      track(obj, 'value')
      return value
    },
  }

  return obj
}
```
