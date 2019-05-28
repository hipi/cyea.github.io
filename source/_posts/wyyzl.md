---
title: 网易云音乐直链获取方法
categories: 杂项
abbrlink: fec2250c
date: 2018-12-24 00:00:00
---

这里需要用到网易云音乐提供的直链 api：https://music.163.com/song/media/outer/url?id=xxx.mp3

这里的 id=xxx.mp3 是根据你需要的歌曲的 ID 进行更改。

> 例如：歌曲：演员-薛之谦

https://music.163.com/#/song?id=32507038

> 修改为：

https://music.163.com/song/media/outer/url?id=32507038.mp3

> DEMO 演示

<audio controls="controls" playsinline="" webkit-playsinline="">
<source src="//music.163.com/song/media/outer/url?id=32507038.mp3" type="audio/mpeg">
</audio>
