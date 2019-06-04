---
title: 必须要掌握的几个JS技巧
thumbnail: 'https://ae01.alicdn.com/kf/HTB1_eaSXHus3KVjSZKbq6xqkFXar.jpg'
categories: 前端
tag:
  - js
abbrlink: 9d7da21c
date: 2019-06-04 17:46:37
---

> 一个合格的前端工程师必须要掌握 JavaScript 技巧

## 更好的处理 async/await

每次使用 async/await 都包裹一层 try/catch ，很麻烦，这里提供另外一个思路

```js
// 定义一个全局方法
async function errorCaptured(asyncFunc) {
  let args = [...arguments].slice(1);
  try {
    let res = await asyncFunc(...args);
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}
// 一个示例异步函数
let asyncFunc = (a, b, c) => {
  return new Promise((resolve, reject) => {
    const num = Math.random().toFixed(1);
    if (num > 0.5) {
      resolve([a, b, c]);
    } else {
      reject([a, b, c]);
    }
  });
};

// 运行
(async () => {
  let [err, res] = await errorCaptured(asyncFunc, 1, 2, 3);
  if (res) {
    console.log("success:" + res);
  }
  if (err) {
    console.log("error:" + err);
  }
})();
```

## 待。。。