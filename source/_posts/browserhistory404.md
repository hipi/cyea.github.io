---
title: BrowserHistory刷新页面404问题
categories: 全栈
tag:
  - js
abbrlink: bd4556bf
date: 2019-01-20 14:36:19
cover: https://qiniu.chenyeah.com/img/20190807115557.jpg
---

> 使用 React 开发新项目时，遇见了刷新页面，直接访问二级或三级路由时，访问失败，出现 404 或资源加载异常的情况，本篇针对此问题进行分析并总结解决方案。

## 发现问题

使用`webpack-dev-server`做本地开发服务器时，正常情况只需要简单使用`webpack-dev-server`指令启动即可，但是当项目处于以下两种情况时，往往需要有嵌套路由和异步加载路由：

- 我们使用 react-router 这种路由库构建单页面应用路由；
- 使用 html-webpack-plugin 插件动态将加载 js 的`script`标签注入 html 文档；

这时，访问首页是可以正常加载页面和 js 等文件的，但是当我们需要访问二级甚至三级路由或者刷新页面时，如`/page1`时，可能会出现两种情况：

- 页面加载失败，返回 Cannot Get（404）；
- 服务响应，但是没有返回 webpack 处理输出的 html 文件，导致无法加载 js 资源;

## 分析解决问题

发现问题后，我们就要开始分析，我们判断这个问题一般是两方面原因造成：

- `react-router`路前端由配置；
- `webpack-dev-server`服务配置；

发现文档中提到了使用`browserHistory`时，会创建真实的`URL`，处理初始/请求没有问题，但是对于跳转路由后，刷新页面或者直接访问该 URL 时，会发现无法正确相应.一下是几种服务器配置解决方式：  


- node

```js
const express = require('express')
const path = require('path')
const port = process.env.PORT || 8080
const app = express()

// 通常用于加载静态资源
app.use(express.static(__dirname + '/public'))

// 在你应用 JavaScript 文件中包含了一个 script 标签
// 的 index.html 中处理任何一个 route
app.get('*', function (request, response){
   response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(port)
console.log(\"server started on port \" + port);
```

- Nginx

```js
server {
   ...
 location / {
    try_files $uri /index.html
 }
}
```

- Apache

```bash
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

以下都是针对服务器的配置，
本地调试，只是使用了`webpack-dev-server`的内置服务，但是我们已经找到问题所在了，就是路由请求无法匹配返回 html 文档，所以接下来就该去`webpack-dev-server`[文档](https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback)查找解决方式了.

这里也分两种情况：

- 没有修改 output.publicPath，即 webpack 配置文件中没有声明值，属于默认情况；
- 设置了 output.publicPath 为自定义值；

webpack 如下配置：

```js
module.exports = {
    //...
  devServer: {
      historyApiFallback: true
  }
};
```
