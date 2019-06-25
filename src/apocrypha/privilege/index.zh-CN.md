---
category: Components
type: 基础组件
title: Privilege
subtitle: 无权限
---

告诉浏览者其对此功能点无操作权限。

## 何时使用

当用户点击到其没有权限操作的功能时，显示此无权限组件，同时引导用户到指定申请权限界面。

## API

参数   |  说明   |  类型  |  默认值
----- | -----  | -----  | -----
title  | 指定无权限功能名称 | string／ReactNode | 无
desc  | 指明其没有权限  | string | 无
href  | 指定申请权限的入口  | url | 无