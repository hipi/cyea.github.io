---
title: 优雅的处理 async/await 异常
thumbnail: "https://ae01.alicdn.com/kf/HTB1_eaSXHus3KVjSZKbq6xqkFXar.jpg"
categories: 前端
tag:
  - js
abbrlink: 9d7da21c
date: 2019-06-04 17:46:37
---

> 每次使用 async/await 都包裹一层 try/catch ，很麻烦，这里提供另外一个思路更好的处理 async/await

## 我的思考

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
      resolve({ a, b, c });
    } else {
      reject({ a, b, c });
    }
  });
};

// 运行
(async () => {
  let [err, res] = await errorCaptured(asyncFunc, 1, 2, 3);
  if (res) {
    console.log("success:", res);
  }
  if (err) {
    console.log("error:", err);
  }
})();
```

## await-to-js

> await-to-js 是运用 Go-lang 处理异常的的灵感

源码是用 ts 写的，短小精悍,我解析成 js

### await-to-js ts 源码

```ts
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}

export default to;
```

### await-to-js js 代码

```js
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
function to(promise, errorExt) {
  return promise
    .then(function(data) {
      return [null, data];
    })
    .catch(function(err) {
      if (errorExt) {
        Object.assign(err, errorExt);
      }
      return [err, undefined];
    });
}
```

### 重新看我的例子

```js
function to(promise, errorExt) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }
      return [err, undefined];
    });
}

// 一个示例异步函数
let asyncFunc = (a, b, c) => {
  return new Promise((resolve, reject) => {
    const num = Math.random().toFixed(1);
    if (num > 0.5) {
      resolve({ a, b, c });
    } else {
      reject({ a, b, c });
    }
  });
};

// 运行
(async () => {
  let [err, res] = await to(asyncFunc(1, 2, 3), { errorTxt: "这是一个错误" });
  if (res) {
    console.log("success:", res);
  }
  if (err) {
    console.log("error:", err);
  }
})();
```

## 总结

两种方法都可以，都是 Go-lang 异常处理的灵感，就性能来说 有一种说法说过多的`try catch` 影响性能。不过现在已经没啥影响，两种方法都可以！
