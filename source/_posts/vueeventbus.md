---
title: Vue中的eventBus使用
categories: 前端
tags:
  - js
  - vue
abbrlink: cd22a207
date: 2019-01-18 01:36:26
---

## 使用 eventBus

在项目入口文件`main.js`中 加入如下代码

```js
// EventBus
window.eventBus = new Vue();
```

这是引入全局变量`eventBus`

## 准备两个需要通信的 vue 组件

1. About.vue

```js
<template>
  <div class="about">
    <h1>This is an {{msg}} page</h1>
    <h2>other :{{other}}</h2>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "about",
      other: "old other"
    };
  },
  created() {
    eventBus.$on("postData", data => {
      this.other = data;
    });
  }
};
</script>
```

代码中 data 里的 other 值一开始是 `old other`,这个组件需要另一个组件返回过来的值来进行更新。
如下代码则是取回 键值是`postData` 的数据

```js
eventBus.$on("postData", data => {
  this.other = data;
});
```

2. Test.vue

```js
<template>
    <div class="test">
        <h1>This is an {{msg}} page</h1>
    </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "test"
    };
  },
  methods: {},
  destroyed() {
    eventBus.$emit("postData", "new other");
  }
};
</script>
```

以下代码是在组件销毁之前给键值`postData` 注入值 `new other`

```js
eventBus.$emit("postData", "new other");
```

## 效果

所以效果就是一开始进入 about 页面时 other 值为 `old other`  
进入 test 页面 再返回时 other 值则变成了 `new other`
