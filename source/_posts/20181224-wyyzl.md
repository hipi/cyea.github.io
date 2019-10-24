---
title: 网易云音乐歌词直链
categories: 杂项
abbrlink: fec2250c
date: 2018-12-24 00:00:00
---

## 音乐

这里需要用到网易云音乐提供的直链 api

```
https://music.163.com/song/media/outer/url?id=xxx.mp3
```

这里的 id=xxx.mp3 是根据你需要的歌曲的 ID 进行更改。

> 例如：歌曲：演员-薛之谦

```
https://music.163.com/#/song?id=32507038
```

> 修改为：

```
https://music.163.com/song/media/outer/url?id=32507038.mp3
```

> DEMO 演示

<audio controls="controls" playsinline="" webkit-playsinline="">
  <source src="//music.163.com/song/media/outer/url?id=32507038.mp3" type="audio/mpeg">
</audio>

## 歌词

> 官方接口

```
http://music.163.com/api/song/media?id=xxx
```

这里的 id=xxx 是根据你需要的歌曲的 ID 进行更改。

**但是 我们只需要 `lyric` 字段,配合`aplayer`想直接出来歌词**

这里只能自己写接口了

> 我的歌词接口

```
https://api.chenyeah.com/wyylyric?id=xxx
```

## 总结

以歌曲 [2 Days](https://music.163.com/#/song?id=517918738)为例

- 网页： [https://music.163.com/#/song?id=517918738](https://music.163.com/#/song?id=517918738)
- 音乐： https://music.163.com/song/media/outer/url?id=517918738.mp3
- 歌词： https://api.chenyeah.com/wyylyric?id=517918738
