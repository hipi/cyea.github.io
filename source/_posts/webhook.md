---
title: webhook初次体验尝试
categories: 全栈
tag:
  - js
  - node.js
  - webhook
  - pm2
abbrlink: 48bbcb52
date: 2019-01-25 11:52:42
---

> 使用 webhook,每次在您的存储库上发生事件时，无论是推送代码，填写问题还是创建拉取请求，您注册的 webhook 地址都可以配置为包含详细信息。这样可以监听代码的任何变动

这次使用它进行代码自动部署及其他处理

## 先决条件

- 服务器 node.js 环境
- `pm2`

  _以上安装教程自行搜索_

## github-webhook-handler

`github-webhook-handler` 这个库是`Node.js` Web 服务器的小型处理程序（或者说是“中间件”），它处理接收和验证来自 GitHub 的 webhook 请求的所有逻辑。

例子：
`app.js`

```js
var http = require("http");
var createHandler = require("github-webhook-handler");
var handler = createHandler({ path: "/webhook", secret: "myhashsecret" });

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777);

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
});

handler.on("issues", function(event) {
  console.log(
    "Received an issue event for %s action=%s: #%d %s",
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  );
});
```

_其中 `createHandler`中的参数如下_

- "path"：`req.url`查看传入请求时要匹配的完整区分大小写的路径/路由。任何不匹配此路径的请求都将导致调用处理程序的回调函数（有时称为 next 处理程序）。
- "secret"：这是一个哈希键，用于创建 GitHub 发送的 JSON blob 的 SHA-1 HMAC 签名。您应该使用 GitHub 注册相同的密钥。任何未提供`X-Hub-Signature`与使用此密钥针对 blob 生成的签名匹配的请求将被拒绝并导致'error'事件（也将使用 Error 对象调用回调）。
- "events"：可选的列入白名单的事件类型数组（请参阅：`events.json`）。如果已定义，`X-Github-Event`则将拒绝在白名单中找不到的任何传入请求。如果只接受单个事件类型，则此选项也可以是字符串。

## 代码部署运行 shell 脚本代码

我们要监听代码变化 同时运行 `shell`代码 例：`build.sh`如下

```shell
#! /bin/bash
cd /www/wwwroot/project
git fetch --all
git reset --hard origin/master
```

### 运行脚本方式

调用子进程进行脚本调用

> 介绍一下两种

#### spawn

```js
var spawn = require("child_process").spawn;
spawn("sh", ["./build.sh"], {
  stdio: "inherit"
});
```

#### execSync

```js
var exec = require("child_process").execSync;
exec("bash ./build.sh", { stdio: "inherit" });
```

我们现在使用第一种

修改 `app.js`

```js
var http = require("http");
var createHandler = require("github-webhook-handler");
var handler = createHandler({ path: "/webhook", secret: "myhashsecret" });
const spawn = require("child_process").spawn;

const runCommand = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let response = "";
  child.stdout.on("data", buffer => (response += buffer.toString()));
  child.stderr.on("data", buffer => (response += buffer.toString()));
  child.on("close", code => {
    console.log(`子进程退出码：${code}`);
    if (code === 0) {
      callback(response);
    }
  });
};

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777);

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  //运行 build.sh
  runCommand("sh", ["./build.sh"], txt => {
    console.log(txt);
  });
});

handler.on("issues", function(event) {
  console.log(
    "Received an issue event for %s action=%s: #%d %s",
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  );
});
```

这样每次 push 代码时都会运行 `build.sh`

## 实际运行

测试可以 先 `node app.js`

浏览器打开 `IP:7777` 是否可以打开，打开说明服务启用成功

实际需要`pm2`常驻后台

运行 `pm2 start --name "webhook" app.js`

## webhook 其他操作

部署好的同时 因为我的静态文件进行了 CDN ，每次部署需要等待一段时间才能生效。所以 我部署的同时 进行 CDN URL 刷新
修改代码如下

```javascript
var http = require("http");
var createHandler = require("github-webhook-handler");
var handler = createHandler({ path: "/webhook", secret: "chenyeah.com" });
const spawn = require("child_process").spawn;
// 腾讯cdn刷新数据
const qcloudSDK = require("qcloud-cdn-node-sdk");
qcloudSDK.config({
  secretId: "<secretId>",
  secretKey: "<secretKey>"
});

const refreshCdnUrl = () => {
  qcloudSDK.request(
    "RefreshCdnUrl",
    {
      "urls.0": "https://chenyeah.com",
      "urls.1": "https://chenyeah.com/js/main.js",
      "urls.2": "https://chenyeah.com/css/style.cssi",
      "urls.3": "https://chenyeah.com/sitemap.xml"
    },
    res => {
      console.log(res.toString());
    }
  );
};

const runCommand = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let response = "";
  child.stdout.on("data", buffer => (response += buffer.toString()));
  child.stderr.on("data", buffer => (response += buffer.toString()));
  child.on("close", code => {
    console.log(`子进程退出码：${code}`);
    if (code === 0) {
      callback(response);
    }
  });
};

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777);

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  if (event.payload.ref === "refs/heads/master") {
    runCommand("sh", ["./build.sh"], txt => {
      console.log(txt);
      refreshCdnUrl();
    });
  }
});

handler.on("issues", function(event) {
  console.log(
    "Received an issue event for %s action=%s: #%d %s",
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  );
});
```

这样每次部署 自动刷新 CDN URL 刷新

## 最后

此篇文章就是稍微使用一下`webhook`
