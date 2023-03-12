- [Options Api 与 Composition Api 的区别？](#options-api-与-composition-api-的区别)
- [与 React hook 对比](#与-react-hook-对比)

# Options Api 与 Composition Api 的区别？

1. options api 是 methods，computed，watch，data
2. reactive、ref、computed、watch、provide、inject

Options Api 在处理一个大型的组件时，内部的逻辑点容易碎片化，分散在 method,computed,watch 里，代码缺乏组织性这个原因很大程度上是和具体的个人有关，只是用 options api 要写出优雅的代码并不是特别容易，这种碎片化使得理解和维护复杂组件变得困难。Composition Api 将某个逻辑关注点相关的代码全都放在一个函数里。

在 vue2.0 里面复用一些纯逻辑的时候一般是 mixin，有命名冲突问题。而 Composition Api 可以通过编写多个 hooks 函数就很好的解决了

类型推断，因为 composition api 是函数，相对于普通对象来说 TS 支持更友好。

并不一定是要完全放弃 optionsApi。

# 与 React hook 对比

1. react hooks 在每次更新的时候都会执行，Vue 只在 setup 执行一次；
2. Hooks 因为使用的是链表结构，所以有严格的调用顺序，不可以写在条件分支中；但是 Vue 这里使用的是数组存储所以不存在这个问题。
3. useEffect 这种 hook 需要自己写 deps 依赖，然后在比较后才会更新执行，尤其是性能优化这一块特别吃个人经验；而 Vue 是通过代理加全局变量加 Mapping 数据结构实现的自动收集依赖，不需要开发者过度关心。
4. react 对于事件处理这种可能需要通过 useCallback 或者 ref 弄成不可变数据来避免多余的更新，但是生成不可变数据的这个过程也是有代价的，还是比较吃经验；Vue 因为响应式系统的原因不需要额外关心，另外他会自动进行事件缓存。
5. react 需要理解闭包问题，vue 不用特意关心。
