---
title: Flex布局兼容国内浏览器的双核模式
categories: 前端
tag:
  - css
abbrlink: 8f449293
date: 2018-06-13 00:00:00
---

flex 布局不支持低版本 ie 内核是确定了，没办法的改变的事实，但是国产浏览器采用哪一个内核打开你的页面，这个是你可以控制的。在 html 的`<head>`标签中加入如下代码：

```
<meta name=\"renderer\" content=\"webkit\">
```

然后浏览器打开你的页面时，会默认采用 chrome 内核来渲染页面，这是 360 浏览器的功能，其他国产浏览器也支持。

但是用户非要点击“兼容模式”怎么办？我们还可以控制浏览器调用的 ie 渲染引擎的版本。在 html 的<head>标签中加入如下代码：

```
<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">
```

这个指令不要被 edge 这个单词迷惑，他指的不是 edge 浏览器。而是告诉 ie 渲染引擎，使用最新内核，且采用标准模式渲染页面。chrome 这个指令也建议保留，他是让 IE 用户打开你的网页时，尝试调用 chrome 框架插件的。这是一个很老的 ie 插件，google 出品，让 ie 支持 chrome 内核。

> 最后这两个指令都添加完毕之后，能实现这样的效果，国产浏览器打开你的网页时，优先调用 chrome 内核渲染。如果用户强制点击，选择兼容模式，会调用操作系统内安装的 IE 的标准模式渲染你的页面。如果用户的操作系统内安装了 ie9 或以上，则正常显示 flex。如果用户使用 ie 打开你的页面，当 ie 版本是 9 以上，或者系统内安装了 chrome 框架插件，flex 也能正常工作。

所以以防万一 尽量 html`<head>`标签中都加入如下代码

```
<meta name=\"renderer\" content=\"webkit\">
<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">
```
