---
category: Components
type: 组合组件
title: MindMap
subtitle: 思维导图
cols: 1
---

提供数据的分层视图

## 何时使用

适用于展示数据的层次结构，形象化展现子节点间的联系。

## 如何使用

 * 指定表格的数据源 `dataSource` 为一个对象。 
 * 子节点封装在 `children` 对象内。
 *  `nodes` 对象指定节点的配置描述


````jsx
dataSource = {
  name:"油站诊断",
  value:95,
  chainRadio:7.8,
  children:[{
    name:"单量",
    value:"516.0",
    chainRadio:"-12.10"
    }, {
    name:"单均价格",
    value:31
    }, {
    name:"商圈单量",
    value:"13437.0"
  }]
}

const nodes = {
  title: 'name',
  value: 'value',
  percent: 'chainRadio',
}

<MindMap dataSource={dataSource} nodes={nodes} />

````

## API

### MindMap

思维导图组件的宽度自适应父级元素的宽度

参数   |  说明   |  类型  |  默认值
----- | -----  | -----  | -----
title  | 指定思维导图名称 | string／ReactNode | 无
desc  | 添加描述  | string | 无
expandDepth  | 指定思维导图默认的展开级数 | number | 无
dataSource  | 指定思维导图的数据源  | object | 无
nodes  | 指定思维导图的节点的的配置描述，具体项见下表  | object | 无

### nodes

参数   |  说明   |  类型  |  默认值
----- | -----  | -----  | -----
title  | 指明节点的标题名称  | string | 无
value  | 指明节点的数值名称  | string | 无
percent  | 指明节点的百分比名称  | string | 无


