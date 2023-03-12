- [模块化标准](#模块化标准)
  - [模块化解决什么问题？](#模块化解决什么问题)
  - [CommonJS](#commonjs)
    - [CommonJS 加载过程](#commonjs-加载过程)
    - [module.exports 和 exports 的区别](#moduleexports-和-exports-的区别)
    - [CommonJS module 模块对象的属性](#commonjs-module-模块对象的属性)
    - [ES6 与 CommonJS 之间的差异](#es6-与-commonjs-之间的差异)
  - [ES Module](#es-module)
    - [ESM 的特点](#esm-的特点)
  - [UMD](#umd)
  - [CMD](#cmd)
  - [AMD](#amd)
- [TreeShaking](#treeshaking)
  - [webpack 中的 TreeShaking 实现原理？](#webpack-中的-treeshaking-实现原理)
  - [实践](#实践)
- [前端安全](#前端安全)
  - [XSS 跨站脚本攻击](#xss-跨站脚本攻击)
    - [XSS 防御](#xss-防御)
  - [CSRF 跨站请求伪造](#csrf-跨站请求伪造)
    - [CSRF 防御](#csrf-防御)
  - [DNS 劫持](#dns-劫持)
  - [http 劫持](#http-劫持)
  - [https 劫持](#https-劫持)

# 模块化标准

前端模块化是一种软件设计思想, 它能够将整个程序按照功能划分成多个模块, 每个模块具有独立的接口和实现.这样就使得代码具有更好的可读性\可维护性\可扩展性和可复用性.模块化的主要特点是: 可复用性\可组合性\独立性\中心化.

## 模块化解决什么问题？

1. 命名冲突: 每个模块的作用域限定在模块内部, 避免全局变量污染.
2. 依赖管理: 可以明确的描述依赖关系, 自动加载依赖的模块, 避免 JS 文件之间的依赖关系\依赖顺序混乱.
3. 可维护性: 模块保持功能稳定, 可以将公共的代码抽离出来, 实现代码的复用, 可以针对模块进行单元测试, 提高代码质量.

## CommonJS

通过 module.exports/exports 导出, 通过 require() 引入模块。

```js
module.exports = {}
exports.hallo = 1

require('./hallo.js')
```

1. 使用 require 方法加载模块, 使用 module.exports/exports 导出模块
2. 延迟加载, 首次加载时会缓存, 再次加载时直接从缓存读取, 避免重复执行和循环引用问题
3. 同步加载, 按照代码顺序依次加载执行
4. 模块作用域, 不会污染全局作用域, 模块只能通过 module.exports/exports 导出接口

### CommonJS 加载过程

1. 核心模块直接返回
2. 解析路径: 将模块路径转换为文件的绝对路径
3. 如果有缓存优先从缓存读取 require.cache, 否则就创建一个 Module 实例并缓存
4. 根据模块路径找到对应的文件
   1. json 文件就直接赋值给 module.exports
   2. js 将文件内容包装成一个函数, 使用 vm 模块转换成真正的函数, 再利用 call/apply 执行包裹的函数, 修改 module.exports 的值

```js
;(function (exports, require, module, __filename, __dirname) {
  // 模块的代码实际上在这里
})()
```

### module.exports 和 exports 的区别

初始时指向统一个引用地址 `module.exports = exports = {}`, 如果重新赋值 exports 会切断引用关系

### CommonJS module 模块对象的属性

1. exports: 代表当前模块对外输出的值
2. filename: 当前模块的完整路径, 包括文件名
3. paths: 搜索模块时要在这些目录里查找
4. loaded: 当前模块是否加载完成, 加载完成为 true, 加载未完成为 false
5. parent: 依赖当前模块的模块
6. children: 当前模块依赖的模块
7. id: 模块标识符, 通常是完全解析后的绝对路径

### ES6 与 CommonJS 之间的差异

## ES Module

### ESM 的特点

1. 使用 import/export 语法导入导出模块, 能够默认导出\命名导出\按需加载, import 会提升到模块作用域的头部
2. 静态解析, 在编译时就能确定依赖关系, 可以根据依赖关系进行优化
3. export 语句输出的接口, 与其对应的值是动态绑定关系(可以理解为引用类型), 即通过该接口可以取到模块内部实时的值；
4. 已经执行的模块会创建一个模块对象, 再次导入时直接从内存中读取, 不会重复执行
5. 自动开启严格模式

## UMD

## CMD

## AMD

# TreeShaking

利用 ES6 模块的静态特性, 在打包时去除未使用的代码。具体来说就是在打包的时候通过静态分析, 提取 usedExports 并且删除未被使用的代码块,从而减小最终打包文件的大小。
CommonJS 是运行时加载的,没有办法确定哪些代码是不会被执行的,所以不适合进行 TreeShaking。

1、实现 tree-shaking 的需满足: 基于 ESM 的模块导入导出规则,可以实现静态编译时处理模块间的依赖
2、tree-shaking 的删除过程类似于 js 的垃圾收集：分析 -> 标记 -> 清除

## webpack 中的 TreeShaking 实现原理？

在 `mode: 'development'` 模式下并开启 `optimization.usedExports: true` 时可以看到打包后的代码中会有 `/* unused harmony export xxx */` 注释, 表示这个模块没有被使用。

1. 收集模块导出, 这一过程发生在 make 阶段, 弄清楚每个模块都导出了什么值
   1. 将模块的所有 ESM 导出语句转换为 Dependency 对象,并记录到 module 对象的 dependencies 集合
   2. 等所有的模块编译完成后, 从 entry 开始遍历 ModuleGraph 存储的所有 module 对象, 遍历 module 对象对应的 dependencies, 针对 HarmonyExportXXXDependency 类型的依赖对象, 转换成 ExportInfo 对象并记录
2. 标记模块导出, 这一过程发生在 seal 阶段, 标记模块的导出列表中的导出值是否被用到过.
   1. 从 entry 开始遍历 ModuleGraph 存储的所有 module 对象, 遍历 module 对象对应的 exportInfo 数组, 然后执行一个 compilation.getDependencyReferencedExports 方法确定是否否被其它模块使用
   2. 对任意模块使用到的导出, 都会记录到 exportInfo.usedInRuntime
3. 生成代码, 用收集好的 exportsInfo 对象为模块的导出值分别生成导出语句. 未被使用的值不会生成导出语句, 也就是不会被定义到`__webpack_exports__`中
   `__webpack_exports__.d(__webpack_exports__, {})`
4. 最后通过 Terser / UglifyJS 去除死代码

## 实践

Webpack 的 TreeShaking 逻辑停留在代码静态分析层面: 只判断模块导出是否被其它模块引用, 引用模块的主体代码中有没有出现这个变量, 所以对于有副作用的函数需要开发者自己去处理.

1. 在调用语句前添加 `#__PURE__` 标记纯函数, 明确本次调用不会对上下文环境产生副作用, 可以安全的删除
2. 使用支持 TreeShaking 的包: lodash-es 等, 或者使用 babel-plugin-lodash 实现类似效果
3. Babel 可以将 import/export 语句转译为 CommonJS 语句, 导致 Webpack 无法对转译后的模块导入导出内容做静态分析
4. 使用 rollup 打包工具库

# 前端安全

## XSS 跨站脚本攻击

1. 反射型: 发生请求时 XSS 代码提交到服务端, 同时响应内容又包含了 XSS 代码, 返回给浏览器解析, 导致恶意 XSS 代码执行. 需要诱导用户点击触发请求
2. 存储型: XSS 代码提交到服务端并存储, 当用户访问页面时, 服务端返回的响应内容包含了 XSS 代码, 返回给浏览器解析, 导致恶意 XSS 代码执行.
3. DOM 型

### XSS 防御

1. 针对输入输出进行检查转义, encodeURI/encodeURIComponent/escape
2. 设置 HttpOnly 属性, 禁止 JS 访问带有 HttpOnly 属性的 Cookie
3. CSP 内容安全策略, 通过 HTTP 头部（Content-Security-Policy）或 mate 元素配置, 控制浏览器可以获取哪些资源
4. 验证码防止脚本提交
5. 谨慎使用 eval/document.write/innerHTML/outerHTML
6. 从 localStorage/SessionStorage/Cookies 中取数据

## CSRF 跨站请求伪造

诱导用户进入第三方网站, 向被攻击网站发送跨站请求. 利用用户在被攻击网站的登录态绕过用户验证, 从而冒充用户进行操作或修改数据.
跨站请求可以用: img/a.href/CORS/form.

1. get 类型: img/script 标签发起请求, 这些标签不受同源策略的限制
2. post 类型: 自动提交的表单
3. 链接类型: 需要用户点击链接才会触发

### CSRF 防御

1. 验证请求头的 Referer
2. cookie 设置 SameSite 属性, strict/lax/none
3. 使用 token 验证, 请求时携带 token 和 cookie. 例如把登陆态放到请求头中, 使用 JWT 验证
4. 关键操作使用验证码

## DNS 劫持

通过识别 DNS 请求, 劫持用户的 DNS 请求, 将用户的 DNS 请求指向其他服务器. 通过 dig 命令查看 DNS 域名解析过程`dig +trace www.baidu.com`

浏览器 > 本机 DNS 缓存> 本机 hosts 文件 > 路由器 > 本地域名服务器 > 根域名服务器 > 顶级域名服务器 > 次级级域名服务器

1. 本机 DNS 劫持, 比如修改 hosts 文件
2. 路由 DNS 劫持, 比如修改路由器的 DNS 设置
3. 攻击 DNS 服务器, 让服务器返回恶意的 IP 地址

## http 劫持

DNS 解析的域名的 IP 地址是正确的, 但是可以修改 HTTP 请求的返回内容, 常见的是发现响应头包含 `content-type: text/html;` 时去修改响应内容.

通过 MutationObserver 监听 DOM 变化, 删除非法的 iframe 和 script 标签, 但是头部插入的代码无法防御, 可以收集信息并向工信部投诉.

## https 劫持

前提是必须用受信任的 SSL 证书才可以劫持

1. 本地信任了恶意的证书
2. MITM 中间人攻击: 攻击者需要向你伪装成服务器, 向服务器伪装成你.
   fiddler/charles/whistle 在抓 https 包之前需要装一个 ca 证书, 很多公司的网管监控就是就需要安装证书劫持员工通信
