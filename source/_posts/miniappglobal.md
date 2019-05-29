---
title: 小程序全局组件的使用
abbrlink: 2b067fbc
date: 2019-02-27 10:46:02
categories: 小程序
tags:
thumbnail: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407607-assets/web-upload/46c42000-5183-4f62-8b84-d26d6b1dbd49.jpeg
---

> 开发小程序时经常会用到全局组件，不限制页面随时可用的组件，但小程序的全局组件非常鸡肋，小程序并不能动态渲染，需要每个页面都需要引入，虽然可以全局声明 （开发者工具 1.02.1810190 支持），但是像全局提醒组件还是需要每个页面写组件，但是可以把组件方法提到全局 也是很好了 ，接下来开始小程序全局组件的使用吧!

## 编写全局提示组件

### index.wxml

```html
<view class="notice-container {{visible?'notice-show':''}}">
  {{ item.content }}
</view>
```

### index.wxss

```css
.notice-container {
  position: fixed;
  top: 0;
  min-height: 30px;
  line-height: 30px;
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  display: none;
}
.notice-container .notice-show {
  display: block;
}
```

### index.js

```js
const default_data = {
  visible: false,
  content: ""
};

let timmer = null;

Component({
  data: {
    ...default_data
  },

  methods: {
    handleShow(options) {
      this.setData({
        ...options,
        visible: true
      });

      const d = 2 * 1000;

      if (timmer) clearTimeout(timmer);
      if (d !== 0) {
        timmer = setTimeout(() => {
          this.handleHide();
          timmer = null;
        }, d);
      }
    },

    handleHide() {
      this.setData({
        ...default_data
      });
    }
  }
});
```

### index.json

```json
{
  "component": true
}
```

## 全局声明

在`app.json`配置中添加如下配置

```json
{
  "usingComponents": {
    "notice": "./components/notice/index"
  }
}
```

## 页面引入

> 这就麻烦了 需要的页面都需要引入只是不需要声明了

页面引入如下

```html
<notice id="notice"></notice>
```

这里的`id` 值很重要后面要用到

## 全局调用

> 接下来很重要新建`notice.js`

```js
function getCtx(selector) {
  const pages = getCurrentPages();
  const ctx = pages[pages.length - 1];

  const componentCtx = ctx.selectComponent(selector);

  if (!componentCtx) {
    console.error("无法找到对应的组件");
    return null;
  }
  return componentCtx;
}
function Notice(options) {
  const { selector = "#notice" } = options; // notice 为刚才的id值
  const ctx = getCtx(selector);

  ctx.handleShow(options);
}
const $notice = Notice;
export default $notice;
```

每个页面全局调用这个 `$notice` 方法就可以了

## 最后

反正小程序的全局组件还是很难用，如果能 js 动态渲染就好了 期待吧。。。
