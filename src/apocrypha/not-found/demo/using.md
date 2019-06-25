---
order: 0
title:
  zh-CN: 基本
  en-US: Type
---

## zh-CN

显示404 NotFound提示

## en-US

There are `primary` button, `default` button, `dashed` button and `danger` button in antd.

````jsx
import { NotFound } from 'fui'

ReactDOM.render(
  <div>
    <NotFound
      title="404"
      desc="未找到此页面！"
    />
  </div>,
  mountNode);
````
