---
title: 从一个文字渐变引发的一系列问题
categories: 前端
tag:
  - css
abbrlink: 679c2788
date: 2019-11-11 18:20:00
---

## 前言

事件的起因是朋友给我发的一个微信

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e599b3edafae3b)

**当时就奇怪字体跟数据绑定有啥关系，处于好奇我让他写个 demo 给我看看 ，然后他发来一个代码文件**

代码精简如下

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Demo</title>
    <style>
      body {
        font-size: 40px;
      }
      .time1 {
        display: inline-block;
        background: linear-gradient(to right, #a6ffcb, #1fa2ff);
        -webkit-background-clip: text;
        color: transparent;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="time1">{{ time }}</div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
    <script>
      new Vue({
        el: "#app",
        data: {
          time: new Date().toLocaleString()
        },
        methods: {
          updateTime() {
            this.time = new Date().toLocaleString();
          }
        },
        mounted() {
          setInterval(this.updateTime, 1000);
        }
      });
    </script>
  </body>
</html>
```

发现在浏览器下时间并不会改变 ，当我在控制台把颜色注释掉后，发现数据是改变的，这就奇怪了呀！ 这里我就试了下 另一种渐变样式写法

## css 文字渐变一些方法

### background 属性

这种我不细说了 也很好理解 可以看上面代码实现方式

### mask 属性

```html
<style>
  .time2 {
    position: relative;
    color: #a6ffcb;
  }
  .time2:before {
    content: attr(time);
    position: absolute;
    z-index: 10;
    color: #1fa2ff;
    -webkit-mask: linear-gradient(to left, #1fa2ff, transparent);
  }
</style>
<div class="time2" time="time">我是渐变文字</div>
```

`:before` 选择器向选定的元素前插入内容。使用 `content` 属性来指定要插入的内容。`mask` 属性让元素的某一部分显示或隐藏

### 第一个：

**content 取值 attr 就是用来获取属性值的，content:attr(属性名)**

`content: attr(time)`; 能获取到元素的 `time` 属性，这里的这个 `time` 属性是自己自定义的一个属性，随便写

```html
<h1 date="前端简单说">前端简单说</h1>
```

然后`content`属性 这样写，`content: attr(date)`; 同样是可以起作用的。

### 第二个：

**mask 属性 允许使用者通过部分或者完全隐藏一个元素的可见区域。这种效果可以通过遮罩或者裁切特定区域的图片。**

详情可看[https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask)

## 回归问题

> 我们试试另一种情况会不会出现不渲染情况

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Demo</title>
    <style>
      body {
        font-size: 40px;
      }
      .time1 {
        display: inline-block;
      }
      .time1 {
        background: linear-gradient(to right, #a6ffcb, #1fa2ff);
        -webkit-background-clip: text;
        color: transparent;
      }
      .time2 {
        position: relative;
        color: #a6ffcb;
      }
      .time2:before {
        content: attr(time);
        position: absolute;
        z-index: 10;
        color: #1fa2ff;
        -webkit-mask: linear-gradient(to left, #1fa2ff, transparent);
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="time1">{{ time }}</div>

      <div class="time2" :time="time">{{ time }}</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
    <script>
      new Vue({
        el: "#app",
        data: {
          time: new Date().toLocaleString()
        },
        methods: {
          updateTime() {
            this.time = new Date().toLocaleString();
          }
        },
        mounted() {
          setInterval(this.updateTime, 1000);
        }
      });
    </script>
  </body>
</html>
```

看下效果

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e59d38907b46bf)

我当时的表情

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e59d808df63c17)

**我想到了是不是浏览器重排和重绘的问题**

## 浏览器重排和重绘

> 我们了解下重排和重绘

浏览器编译页面分为 5 步

1. 处理 html 生成 DOM（Document Object Model） Tree
2. 处理 css 生成 CSSOM（CSS Object Model） Tree
3. DOM 树与 CSS-DOM 树合并为 Render 树
4. 对 Render 树进行布局计算
5. 遍历 Render 树的每一个节点绘制到屏幕

### 重绘与重排概念

当 DOM 变化影响了元素的几何属性（宽、高改变等等），浏览器此时需要重新计算元素几何属性，并且页面中其他元素的几何属性可能会受影响，这样渲染树就发生了改变，也就是重新构造 RenderTree 渲染树，这个过程叫做重排（reflow）

如果 DOM 变化仅仅影响的了背景色等等非几何属性，此时就发生了重绘（repaint）而不是重排，因为布局没有发生改变

**页面布局和元素几何属性的改变就会导致重排**

下列情况会发生重排：

- 页面初始渲染
- 添加/删除可见 DOM 元素
- 改变元素位置
- 改变元素尺寸（宽、高、内外边距、边框等）
- 改变元素内容（文本或图片等）
- 改变窗口尺寸
- 不同的条件下发生重排的范围及程度会不同
- 某些情况甚至会重排整个页面，比如滑动滚动条
- 以下属性或方法会刷新渲染队列(offsetTop、offsetLeft、offsetWidth、offsetHeight
  clientTop、clientLeft、clientWidth、clientHeight
  scrollTop、scrollLeft、scrollWidth、scrollHeight
  getComputedStyle()（IE 中 currentStyle）)

### 问题

这边时间文字改变了，但文字大小没变，我感觉按道理应该没有触发重排从而使背景色没有改变 ，那我试试改变文字大长度试试

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Demo</title>
    <style>
      body {
        font-size: 40px;
      }
      .time1 {
        display: inline-block;
      }
      .time1 {
        background: linear-gradient(to right, #a6ffcb, #1fa2ff);
        -webkit-background-clip: text;
        color: transparent;
      }
      .time2 {
        position: relative;
        color: #a6ffcb;
      }
      .time2:before {
        content: attr(time);
        position: absolute;
        z-index: 10;
        color: #1fa2ff;
        -webkit-mask: linear-gradient(to left, #1fa2ff, transparent);
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="time1">{{ time }}</div>

      <div class="time2" :time="time">{{ time }}</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
    <script>
      new Vue({
        el: "#app",
        data: {
          time: new Date().toLocaleString(),
          arr: [
            "奥术大师大所大所",
            "噶事发傻手法十分",
            "按时间大胜靠德德",
            "奥斯卡拉家带口拉丝机迪卡龙"
          ]
        },
        methods: {
          updateTime() {
            // this.time = new Date().toLocaleString();
            this.time = this.arr[Math.floor(Math.random() * this.arr.length)];
          }
        },
        mounted() {
          setInterval(this.updateTime, 1000);
        }
      });
    </script>
  </body>
</html>
```

效果如下

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e59e5e5340ae04)

**发现确实，文字长度没变，第一个不会重新渲染，长度一旦发生改变，第一个才会改变渲染，而第二个一直在渲染**

问题好像突然找到原因了，但我又无意发现新的问题

## 新的问题

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Demo</title>
    <style>
      body {
        font-size: 40px;
      }
      .time1 {
        display: inline-block;
      }
      .time1,
      .time3 {
        background: linear-gradient(to right, #a6ffcb, #1fa2ff);
        -webkit-background-clip: text;
        color: transparent;
      }
      .time2 {
        position: relative;
        color: #a6ffcb;
      }
      .time2:before {
        content: attr(time);
        position: absolute;
        z-index: 10;
        color: #1fa2ff;
        -webkit-mask: linear-gradient(to left, #1fa2ff, transparent);
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div class="time1">{{ time }}</div>

      <div class="time2" :time="time">{{ time }}</div>
      <div>
        <span class="time3">{{ time }}</span>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
    <script>
      new Vue({
        el: "#app",
        data: {
          msg: "Hello",

          time: new Date().toLocaleString()
        },
        methods: {
          updateTime() {
            this.time = new Date().toLocaleString();
          }
        },
        mounted() {
          setInterval(this.updateTime, 1000);
        }
      });
    </script>
  </body>
</html>
```

**当我改变 dom 结构发现又好了**

效果如下

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e59eaebf701ffe)

好了 我彻底呆了

![](https://api.chenyeah.com/juejinimg/2019/11/11/16e59ebcfa7b8319)

## 最后

最后我也没搞明白，不过为了保险起见以后类似这种还是用第二种渐变样式吧！
