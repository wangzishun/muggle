- [和 react 有什么不同](#和-react-有什么不同)
- [基础组件](#基础组件)
- [动态或者脚本语言要跟本地语言互通](#动态或者脚本语言要跟本地语言互通)
- [是怎么渲染出原生组件的](#是怎么渲染出原生组件的)
- [性能](#性能)
- [原生模块](#原生模块)
- [React Native 启动时](#react-native-启动时)
- [codepush](#codepush)
- [ios 和 android 适配](#ios-和-android-适配)
- [跨平台的局限性](#跨平台的局限性)
- [缓存 AsyncStorage](#缓存-asyncstorage)
- [Taro](#taro)
- [库](#库)

# 和 react 有什么不同

一般 web 开发用的一套是 scheduler/react/react-dom，RN 主要是在渲染器这里用 react-native 替换了 react-dom， 用来实现原生的 UI 组件，在 ios 和 android 平台上分别是 Objective-C 和 Java。

# 基础组件

ActivityIndicator/Button/View/Text/ImageView/FlatList/SectionList/ScrollView/RefreshControl/Switch/TextInput/VirtualizedList

# 动态或者脚本语言要跟本地语言互通

1. 本地语言有一个 runtime 机制来对对象的方法调用进行动态解析。
2. 本地语言一定有一个脚本的解析引擎
3. 建立一个脚本语言到本地语言的映射表，KEY 是脚本语言认识的符号，VALUE 是本地语言认识的符号。通过这个映射表来构建从脚本到本地的调用。

# 是怎么渲染出原生组件的

1. 创建一个根 View 来展示 RN；
2. 创建 Bridge 桥接对象；
3. 加载 jsbundle；
4. 建立一个原生模块的映射表；
5. 执行 JS 代码，这个过程中最关键的就是 AppRegistry.registerComponent，实际上这里是通过 Bridge 调用了原生模块，把这个操作放到一个队列中。
6. 执行完 js 之后，原生就能拿到一个队列，队列中放着（module 模块，method 方法，arguments 参数），原生就会去遍历队列，执行模块对象上的方法并传参数。

# 性能

RN 自带一个实时帧数监控的模块，Show FPS Monitor

ListView 用的 FlatList（getItemLayout）或者 SectionList（getItemLayout）

# 原生模块

NativeModule 系统将 Java/Objective-C/C++（本机）类的实例作为 JS 对象公开给 JavaScript (JS)，从而允许您从 JS 中执行任意本机代码
新架构遥遥无期(新 TurboModule 和 Fabric)

# React Native 启动时

大致分为两个部分：Native 容器的运行 JavaScript 代码的运行；其中 Native 容器启动大致可以分为 3 个部分：Native 容器初始化，Native Modules 的全量绑定，JSEngine 的初始化；再之后就是 JS 运行，流程可以细分为 2 个部分：JavaScript 代码的加载、解析和执行、React 的调度与运行（例如 Fiber 的构建）。最后 JS Thread 把计算好的布局信息发送到 Native 端，计算 Shadow Tree，最后由 UI Thread 进行布局和渲染。

# codepush

app 启动时判断是否需要更新，如果需要更新，就下载新的 bundle 去加载 bundle 文件，然后重启 app，这样就可以实现热更新了。

通过 code-push app add MyAppIOS ios react-native 来创建 iOS 端的 App，或者通过 code-push app add MyAppAndroid android react-native 创建 Android 端的 App。
使用 code-push app ls 查看是否添加成功，默认会创建两个部署（deployment）环境：Staging 和 Production，可以通过 code-push deployment ls MyAppIOS -k 来查看当前 App 所有的部署，-k 是用来查看部署的 key，这个 key 是要方法原生项目中去的。
添加一个 Test 部署环境：code-push deployment add MyAppIOS Test，添加成功后，就可以通过 code-push deployment ls MyAppIOS -k 来查看 Test 部署环境下的 key 了

js 把 app 版本号和正在用的更新包信息和部署的 key 传递给原生，原生调用 code-push 服务器查询是否有更新包可以使用，可以的话就下载更新包。这里面还包括一些标志位的处理，对应着 codepush 客户端的 installed/pending/rollback/failed 等状态。

# ios 和 android 适配

Platform.OS 判断平台。
RN 组件的文档里面有 android 和 ios 的标记，用的时候要注意一下兼容问题。
图片适配问题，可以用@2x、@3x 来区分不同分辨率的图片。

很多功能还是需要原生来支持的，比如阴影、图片裁剪、图片压缩、图片缓存、图片预览、图片上传、图片下载、图片选择、图片编辑、图片滤镜、图片旋转、图片缩放、图片裁剪、图片保存、图片分享、图片预览、图片浏览

阴影：ios shadowOffset/shadowRadius；android elevation；或者用 react-native-shadow
字体缩放：allowFontScaling，手机系统调节字体大小后，app 中的文本字体大小也会随之变化，尤其在 Android 上影响非常明显，导致 UI 错乱

# 跨平台的局限性

很多功能使用原生方案实现是更好的选择，比如拍照、图片编辑、动画使用原生 API 实现更直接、性能表现更好。开发人员还是需要会原生开发，不然自定义组件无法编码；开发复杂应用必须精通原生开发，开发效率并不比原生开发的熟手快。很多问题（包括兼容性问题解决）任然需要原生开发。

Android 和 iOS 系统更新或者条款更新总会需要开发者做一些适配工作。对于 iOS 来说，要适配更新的 iOS 系统，我们经常需要升级 Xcode，可能在新版本的 Xcode 上就会遇到原来能编译通过的项目现在却编译失败了。
调试不方便，RN 需要 JS 的运行环境，在开发模式下本地需要启动一个 package server 来监控文件的变更，配合 chrome 或者 react dev tools 来调试 JS 代码。Native 代码仍然需要使用 Android studio 或者 Xcode 来调试。让人难受的是有时候会因为环境问题或者第三方库的原因导致频繁出现红屏报错，为了解决这些 error 需要各种 search，时间就耗在这些问题上了。
安全性存在问题。RN 打包时会把 JS 代码和资源文件打包成一个 js bundle 文件，这个 bundle 文件中就包含了所有编译之后的 JS 代码，因此一些重要的配置信息如 API key、secret 等最好不要写在 JS 代码中，以免造成安全问题。官方文档也针对 security 做了比较清楚的说明。

稳定性问题。RN 的稳定性与原生平台是有差距的。RN 需要 JS 的运行环境来解释执行 JS 编译之后的 bundle 文件，在 Android 端使用了 webkit 官方开源的 jsc.so，此外还有很多其它的 so 调用，比如 Android 系统的 libc.so。一些 crash 问题就是由动态链接库造成的，可能跟用户本身设备系统版本和 webview 版本有关，系统库导致的 crash 也没有堆栈信息，因此这些问题很难定位原因，比如 libc.so 导致的 crash。还有 RN 组件本身导致的 crash，这些问题都是 RN 稳定性不如原生的因素之一。

# 缓存 AsyncStorage

AsyncStorage 它是一个简单、异步、持久化的键值对存储系统，它对于 App 来说是全局的。可以用来替代 LocalStorage。

# Taro

# 库

react-native-swiper ★6955 - React Native 的最好用的滑块组件
victory-native ★1264 - Victory-native 是一个组件集合，可以帮助您创建图表、条形图等。
react-native-root-siblings ★452 - 在你的应用根元素之后添加兄弟元素。
