---
title: git commit 规范以及规范校验
categories: 全栈
tag:
  - git
abbrlink: "473e906"
date: 2019-04-01 23:36:09
---

## 前言

在多人协作项目中，如果代码风格不统一、代码提交信息的说明不准确，那么在后期协作以及 Bug 处理时会非常艰难。因此 git commit 提交规范极其重要。本文主要介绍 git commit 提交规范，以及用工具在 git commit 代码之前检测 commit messages 是否符合规范.

## Angular 的 commit 规范

```
<type>(<scope>): <subject>
```

### type

用于说明 commit 的类别，只允许使用下面 7 个标识。

- feat: 新功能（feature）
- fix: 修补 bug
- docs: 文档（documentation）
- style: 格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
- test: 增加测试
- build: 改变了build工具
- revert: 还原
- perf: 性能优化
- ci: 持续集成

### Scope(选填)

用来说明本次 Commit 影响的范围，即简要说明修改会涉及的部分。这个是选填项，但还是建议填

### Subject

用来简要描述本次改动和概述。

- 通常以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
- 首字母不要大写
- 结尾不用句号(.)

## 工具校验 commit 是否符合规范

我们可以用 `husky` 工具校验，他是个`git hook`可以防止坏`git commit`，`git push`

### 规范格式

这边采用 Angular `Commit message`的格式

### 安装工具及配置

```bash
npm install husky --save-dev
```

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli

```

### 配置文件

在文件根目录新建配置文件`commitlint.config.js`

```js
// commitlint.config.js
module.exports = { extends: ["@commitlint/config-conventional"] }; //采用angular 格式
```

### git hook

**要在创建之前提交提交，您可以使用 Husky 的'commit-msg'钩子：**

```json
// package.json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### 提交检测

之后提交都会验证规则 不符合则会拦截

## 生成 changelog 文件

如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成。生成的文档包括以下三个部分：

- New features
- Bug fixes
- Breaking changes.

每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。

```bash
npm install  conventional-changelog-cli --save-dev
```

```json
// package.json
"scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
  }
```

运行 `npm run changelog` 则可自动生成 `CHANGELOG.md`
