---
title: 二维码api接口
categories: 服务端
tag:
  - node
  - js
abbrlink: 2d537b50
date: 2019-04-02 16:43:46
thumbnail: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407700-assets/web-upload/6944447e-2b67-4e35-9ab4-4aec130b4471.jpeg
---

> 自己搭了一个在线二维码生成接口

## 二维码接口地址

```js
https://api.chenyeah.com/qr?
```

## API 参数说明

- text : 二维码内容
- size : 二维码大小 ( `Number` 单位 px, 默认 240 ,范围 100~1000)

示例： 浏览器打开[https://api.chenyeah.com/qr?text=https://chenyeah.com](https://api.chenyeah.com/qr?text=https://chenyeah.com) 即可看到二维码

## TODO

- 添加美化
