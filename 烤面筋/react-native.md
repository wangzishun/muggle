- [和 react 有什么不同](#和-react-有什么不同)
- [问题](#问题)
- [基础组件](#基础组件)
- [性能](#性能)
- [原生模块](#原生模块)
- [React Native 启动时](#react-native-启动时)
- [缓存 AsyncStorage](#缓存-asyncstorage)
- [codepush](#codepush)
- [库](#库)

# 和 react 有什么不同

一般 web 开发用的一套是 scheduler/react/react-dom，RN 主要是在渲染器这里用 react-native 替换了 react-dom， 用来实现原生的 UI 组件，在 ios 和 android 平台上分别是 Objective-C 和 Java。

# 问题

RN 组件库生态不够好，当遇到某些特殊功能，需要花费大量时间、精力完成；性能方面也无法媲美原生；
编程方面， ios 和 android 代码并非通用，有可能需要维护两套代码或者在代码中做一些条件判断或编译，比如阴影；

开发人员还是需要会原生开发，不然自定义组件无法编码；开发复杂应用必须精通原生开发，开发效率并不比原生开发的熟手快。很多问题（包括兼容性问题解决）任然需要原生开发。

升级 RN 版本或需要大动干戈，尤其向下兼容不好；

# 基础组件

ActivityIndicator/Button/View/Text/ImageView/FlatList/SectionList/ScrollView/RefreshControl/Switch/TextInput/VirtualizedList

# 性能

RN 自带一个实时帧数监控的模块，Show FPS Monitor

ListView 用的 FlatList（getItemLayout）或者 SectionList（getItemLayout）

# 原生模块

NativeModule 系统将 Java/Objective-C/C++（本机）类的实例作为 JS 对象公开给 JavaScript (JS)，从而允许您从 JS 中执行任意本机代码
新架构遥遥无期(新 TurboModule 和 Fabric)

# React Native 启动时

大致分为两个部分：Native 容器的运行 JavaScript 代码的运行；其中 Native 容器启动大致可以分为 3 个部分：Native 容器初始化，Native Modules 的全量绑定，JSEngine 的初始化；再之后就是 JS 运行，流程可以细分为 2 个部分：JavaScript 代码的加载、解析和执行、React 的调度与运行（例如 Fiber 的构建）。最后 JS Thread 把计算好的布局信息发送到 Native 端，计算 Shadow Tree，最后由 UI Thread 进行布局和渲染。

# 缓存 AsyncStorage

AsyncStorage 它是一个简单、异步、持久化的键值对存储系统，它对于 App 来说是全局的。可以用来替代 LocalStorage。

# codepush

app 启动时判断是否需要更新，如果需要更新，就下载新的 bundle 去加载 bundle 文件，然后重启 app，这样就可以实现热更新了。

通过 code-push app add MyAppIOS ios react-native 来创建 iOS 端的 App，或者通过 code-push app add MyAppAndroid android react-native 创建 Android 端的 App。
使用 code-push app ls 查看是否添加成功，默认会创建两个部署（deployment）环境：Staging 和 Production，可以通过 code-push deployment ls MyAppIOS -k 来查看当前 App 所有的部署，-k 是用来查看部署的 key，这个 key 是要方法原生项目中去的。
添加一个 Test 部署环境：code-push deployment add MyAppIOS Test，添加成功后，就可以通过 code-push deployment ls MyAppIOS -k 来查看 Test 部署环境下的 key 了

js 把 app 版本号和正在用的更新包信息和部署的 key 传递给原生，原生调用 code-push 服务器查询是否有更新包可以使用，可以的话就下载更新包。这里面还包括一些标志位的处理，对应着 codepush 客户端的 installed/pending/rollback/failed 等状态。

# 库

react-native-swiper ★6955 - React Native 的最好用的滑块组件
victory-native ★1264 - Victory-native 是一个组件集合，可以帮助您创建图表、条形图等。
react-native-root-siblings ★452 - 在你的应用根元素之后添加兄弟元素。
