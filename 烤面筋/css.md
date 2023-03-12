- [盒模型](#盒模型)
- [BFC Block Formatting Context 块级格式化上下文](#bfc-block-formatting-context-块级格式化上下文)
- [CSS 中解决浮动中高度塌陷的方案](#css-中解决浮动中高度塌陷的方案)
- [Flex 布局 (Flexible Box， 弹性布局)](#flex-布局-flexible-box-弹性布局)
- [选择器](#选择器)
- [z-index 层叠](#z-index-层叠)
- [伪类和伪元素及使用场景](#伪类和伪元素及使用场景)
- [src 和 href 区别](#src-和-href-区别)
- [创建独立图层](#创建独立图层)
- [硬件加速](#硬件加速)
- [column 布局](#column-布局)
- [不定宽高元素的水平垂直居中](#不定宽高元素的水平垂直居中)
- [CSS 继承](#css-继承)

# 盒模型

content padding border margin

# BFC Block Formatting Context 块级格式化上下文

BFC 是一个独立的渲染区域，相当于一个容器，在这个容器中的样式布局不会受到外界的影响。
触发条件：浮动元素 float、绝对定位 position absolute/fixed、overflow 除 visble 以外的值、display 为 inline/tabel-cells/flex 都能构建 BFC。

解决了

- 处于同一个 BFC 的元素外边距会产生重叠（此时需要将它们放在不同 BFC 中）；
- 清除浮动（float），使用 BFC 包裹浮动的元素即可
- 阻止元素被浮动元素覆盖，应用于两列式布局，左边宽度固定，右边内容自适应宽度（左边 float，右边 overflow）
- 计算 BFC 的高度时，浮动元素也参与计算

布局规则：

- 属于同一个 BFC 的两个相邻 Box 垂直排列
- 属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
- BFC 中子元素的 margin box 的左边， 与包含块 (BFC) border box 的左边相接触 (子元素 absolute 除外)
- BFC 的区域不会与 float 的元素区域重叠
- 计算 BFC 的高度时，浮动子元素也参与计算
- 文字层不会被浮动层覆盖，环绕于周围

# CSS 中解决浮动中高度塌陷的方案

两种：clear 属性 和 BFC 法。
clear 的话就需要新增一个元素或者用伪元素 both/left/right。clear 的意思是设置了 clear 的元素他左边或者右边或者两边都不允许有浮动元素
BFC 的话一般是设置 overflow:hidden，这个对子项目的影响最小

# Flex 布局 (Flexible Box， 弹性布局)

flex 布局分为容器和项目, 容器中默认有水平主轴和垂直交叉轴, 项目默认沿着主轴排列

会导致子元素的 float、clear 和 vertical-align 属性将失效

容器属性有 6 个:

- flex-direction 决定主轴的方向 row / column / row-reverse / column-reverse
- flex-wrap 控制换行 nowrap / wrap / wrap-reverse
- flex-flow <flex-direction: row> || <flex-wrap: nowrap>
- justify-content 在主轴上的对齐方式
- align-items 在交叉轴上的对齐方式
- align-content 多条轴线的对齐方式

项目属性也有 6 个:

- order 项目的排列顺序
- flex-grow 放大比例 0
- flex-shrink 缩小比例 1
- flex-basis 在分配多余空间之前, 项目占的空间. auto: 项目本来的大小
- flex default(0 1 auto) auto(1 1 auto) none(0 0 auto)
- align-self 可以覆盖 align-item 属性, default(auto, 继承容器的 align-items)

# 选择器

important
行内样式
id 选择器（ # myid）
类选择器（.myclassname） 伪类选择器（a:hover, li:nth-child）
标签选择器（div, h1, p） 属性选择器（a[rel = "external"]）
相邻选择器（h1 + p）子选择器（ul > li）
后代选择器（li a）
通配符选择器（ \* ）

# z-index 层叠

概念有两个，层叠上下文、层叠水平，层叠上下文是一个概念上的东西，根据层叠规则决定位置的一个环境。还需要注意的一点是，具有层叠上下文的元素比普通元素要更靠近眼睛。层叠水平就是：在一个层叠上下文的环境下，元素在 z 轴上的排列顺序的规则，而层叠顺序就是这里说的具体规则，是实践的东西。

但我们主要关心的是在统一上下文中的层叠顺序规则，层叠顺序表示的是装饰、布局、内容这三点的顺序，从低到高 background/border -> 负 z-index -> block -> float -> inline -> z-index auto/0 -> 正 z-index。

只有同一个层叠上下文中进行比较才有意义，所以要先确定好层叠上下文。html(根层叠上下文)、position:relative/position:absolute 的定位元素
z-index 值不为 auto 的 flex 项(父元素 display:flex|inline-flex).
元素的 opacity 值不是 1.
元素的 transform 值不是 none.
元素 mix-blend-mode 值不是 normal.
元素的 filter 值不是 none.
元素的 isolation 值是 isolate.
will-change 指定的属性值为上面任意一个。
元素的-webkit-overflow-scrolling 设为 touch

# 伪类和伪元素及使用场景

伪类即：当元素处于特定状态时才会运用的特殊类。开头为冒号的选择器，用于选择处于特定状态的元素。
比如:first-child 选择第一个子元素；:hover 悬浮在元素上会显示；:focus 用键盘选定元素时激活；:link + :visted 点击过的链接的样式;:not 用于匹配不符合参数选择器的元素；:fist-child 匹配元素的第一个子元素；:disabled 匹配禁用的表单元素

伪元素，伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过::before 来在一个元素前增加一些文本，并为这些文本添加样式。::first-line

# src 和 href 区别

浏览器解析方式
当浏览器遇到 href 会并行下载资源并且不会停止对当前文档的处理。(同时也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式)
当浏览器解析到 src ，会暂停其他资源的下载和处理，直到将该资源加载或执行完毕。(这也是 script 标签为什么放在底部而不是头部的原因)

# 创建独立图层

transform 3D 或者透视变换 perspective 的 CSS 属性。
使用加速视频解码的 video 元素。
拥有 3D（WebGL） 上下文或者加速 2D 上下文的 canvas 元素。
对自己的 opacity 做 CSS 动画或使用一个动画 webkit 变换的元素。
filter
元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)。
元素有一个兄弟元素在复合图层渲染，并且该兄弟元素的 z-index 较小，那这个元素也会被应用到复合图层。

# 硬件加速

transform、opacity、filter、will-change

# column 布局

column-count
column-width
column-gap 列间间隙
column-rule 分割线

# 不定宽高元素的水平垂直居中

水平居中：

- flex 布局，justify-content: center
- 若是行内元素，给其父元素设置 text-align:center 即可实现行内元素水平居中
- 若是块级元素，该元素设置 margin:0 auto 即可（元素需要定宽）
- 若是块级元素，设置父元素为 flex 布局，子元素设置 margin:0 auto 即可（子元素不需要定宽）

垂直居中：

- flex 布局，align-items: center
- 若元素是单行文本, 则可设置 line-height 等于父元素高度
- 若是块级元素，设置父元素为 flex 布局，子元素设置 margin: auto 0 即可（子元素不需要定宽）
- 若元素是行内块级元素，基本思想是使用 display: inline-block, vertical-align: middle 和一个高度 100%的伪元素让内容块处于容器中央：

# CSS 继承

可以继承的有 font 字体系列、text 文本系列、visibility、cursor 光标

不可继承：display、盒模型、背景、定位
