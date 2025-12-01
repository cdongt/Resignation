---
<%*
let title = tp.file.title;
title = await tp.system.prompt("请输入题目名字：");
tp.file.title = title;
await tp.file.rename(title);
let link = tp.file.path(true);

-%>
题目:  "<% title %>"
本地位置📂: <% link %>
文件链接🔗: <% tp.system.prompt("请输入题目链接：") %>
平台: <% tp.system.suggester(["牛客","LeetCode"],["牛客","LeetCode"],true,'这是哪个平台的题目？') %>
真题来源: <% tp.system.suggester(["华为","非真题"],["华为","非公司真题"],true,'这是哪个公司的真题吗？') %>
难度: <% tp.system.suggester(["简单","中等","较难","困难"],["简单","中等","较难","困难"],true,'这是什么难度的题目？') %>
是否做对: <% tp.system.suggester(["YES","NO"], ["YES","NO"], true, '第一次是否做对了？') %>
复习次数: <% tp.system.suggester(["0","1","2", "3","4","5"], ["0","1","2", "3","4","5"], true, '复习次数') %>
掌握程度: <% tp.system.suggester(["不会","会","熟", "精","通"], ["不会","会","熟", "精","通"], true, '目前掌握程度如何？') %>
创建时间: 
最新更新时间: 
Tags: 

---


## 题目


<br>

## 解题思路


<br>

## 解题代码



<br>

## 语法学习



<br>

## 后续回顾思考











