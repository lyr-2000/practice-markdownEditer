# markdown 文档编辑器的开发

## 核心模块

moudle       | more
------------ | ----------------------------------------------------
CodeMirror   | [在线代码编辑器](https://github.com/codemirror/CodeMirror)
marked       | [转化mardown文档为html文档](https://github.com/chjj/marked)
highlight.js | [代码高亮](https://github.com/isagalaev/highlight.js)

## 相关资料

文档                                                             | more
-------------------------------------------------------------- | -----------------
[在线代码编辑器CodeMirror简介](https://zhuanlan.zhihu.com/p/22163474)   | 大致的了解一下CodeMirror
[CodeMirror官方文档](http://codemirror.net/doc/manual.html)        | -
[CodeMirror API 整理](./doc/CodeMirror模块.md)                     | 个人整理的CodeMirror文档
[marked API 整理](./doc/marked模块.md)                             | 个人整理的marked文档
[markdown-edit](https://github.com/georgeOsdDev/markdown-edit) | 别人的很不错的示例项目

## 开始

```
git clone https://github.com/treecrow/markdown-editer
cd markdown-editer
yarn install

open the index.html in brower
```

## 遗留的问题

问题                     | more
---------------------- | -----------------------------------------
图片上传                   | 需要后台配合，用户图片上传成功后，获取到对应图片的链接，插入到mardown文档中
编辑区域与展示区域同步滚动          | 一个区域滚动，另外一个区域跟着滚动，使对应的内容同时在视口中
编辑区域与展示区域大小自由调整        | 两个区域中间有个滑块
markdown代码有没有代码规范化的操作？ | 并没有代码规范化的插件
发表文章                   | 功能的实现后面再说
展示区域代码高亮无效的问题          | `<pre><code>`里面的代码
