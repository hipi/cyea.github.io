---
title: git命令的代码统计方法
categories: 全栈
tag:
  - git
abbrlink: 4f63b216
date: 2019-03-17 17:14:30
---

> 最近需要统计每个人的 git 代码提交，搜了一下才发现这个以作记录!

## 1.统计所有人代码量

> 统计所有人代码增删量，拷贝如下命令，直接在 git bash 等终端，git 项目某分支下执行

```bash
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

## 2.统计指定提交者代码量

> 统计单个提交者代码量，将下面的--author="username" 中的 username 替换成具体的提交者，然后执行

```bash
git log --author="username" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -
```
