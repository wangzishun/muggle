# 盒模型

content padding border margin

# BFC Block Formatting Context 块级格式化上下文

# Flex 布局 (Flexible Box， 弹性布局)

- 子元素的 float、clear 和 vertical-align 属性将失效

- flex 布局分为容器和项目, 容器中默认有水平主轴和垂直交叉轴, 项目默认沿着主轴排列

- 容器属性有 6 个:

  - flex-direction 决定主轴的方向 row / column / row-reverse / column-reverse
  - flex-wrap 控制换行 nowrap / wrap / wrap-reverse
  - flex-flow <flex-direction: row> || <flex-wrap: nowrap>
  - justify-content 在主轴上的对齐方式
  - align-items 在交叉轴上的对齐方式
  - align-content 多条轴线的对齐方式

- 项目属性也有 6 个:
  - order 项目的排列顺序
  - flex-grow 放大比例 0
  - flex-shrink 缩小比例 1
  - flex-basis 在分配多余空间之前, 项目占的空间. auto: 项目本来的大小
  - flex default(0 1 auto) auto(1 1 auto) none(0 0 auto)
  - align-self 可以覆盖 align-item 属性, default(auto, 继承容器的 align-items)

# 选择器
