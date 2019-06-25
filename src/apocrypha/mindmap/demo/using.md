---
order: 0
title:
  zh-CN: 基本
  en-US: Type
---

## zh-CN

显示动态生成的思维导图，具有展开、折叠子节点功能

## en-US

Display dynamically generated mind maps with expand/collapse functionality.


````jsx
import { MindMap } from 'fui'

const nodes = {
  title: 'name',
  value: 'value',
  percent: 'chainRadio',
}

 const dataSource = {
  "name": "油站诊断",
  "value": null,
  "unit": null,
  "chainRadio": null,
  "children": [{
      "name": "单量",
      "value": "5165.0",
      "unit": "%",
      "chainRadio": "11.89",
      "children": [{
          "name": "单量占商圈到站司机比重",
          "value": "23.11",
          "unit": "%",
          "chainRadio": "-1.04",
          "children": [{
              "name": "门店新用户",
              "value": "436.0",
              "unit": "%",
              "chainRadio": "30.54"
          }, {
              "name": "门店老用户",
              "value": "4729.0",
              "unit": "%",
              "chainRadio": "10.44",
        //   "children": [{
        //       "name": "门店新用户",
        //       "value": "436.0",
        //       "unit": "%",
        //       "chainRadio": "30.54"
        //   }, {
        //       "name": "门店老用户",
        //       "value": "4729.0",
        //       "unit": "%",
        //       "chainRadio": "10.44"
        //   }]
          }]
      }, {
          "name": "到站司机",
          "value": "4955.0",
          "unit": "%",
          "chainRadio": "20.12",
          "children": null
      }, {
          "name": "相对商圈单量百分比",
          "value": "92.56",
          "unit": "%",
          "chainRadio": "3.98",
          "children": null
      }, {
          "name": "新老用户订单",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "门店新用户",
              "value": "436.0",
              "unit": "%",
              "chainRadio": "30.66"
          }, {
              "name": "门店老用户",
              "value": "4729.0",
              "unit": "%",
              "chainRadio": "10.44"
          }]
      }, {
          "name": "相对城市单量百分比",
          "value": "17.62",
          "unit": "%",
          "chainRadio": "4.76",
          "children": null
      }, {
          "name": "车主类型",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "专快单量",
              "value": "4217.0",
              "unit": "%",
              "chainRadio": "18.12"
          }, {
              "name": "顺风车单量",
              "value": "545.0",
              "unit": "%",
              "chainRadio": "-19.85"
          }, {
              "name": "出租车单量",
              "value": "390.0",
              "unit": "%",
              "chainRadio": "14.37"
          }, {
              "name": "乘客端单量",
              "value": "0.0",
              "unit": "%",
              "chainRadio": "-"
          }, {
              "name": "其他来源",
              "value": "7.0",
              "unit": "%",
              "chainRadio": "-61.11"
          }, {
              "name": "代驾单量",
              "value": "6.0",
              "unit": "%",
              "chainRadio": "-14.29"
          }]
      }]
  }, {
      "name": "单均价格",
      "value": null,
      "unit": null,
      "chainRadio": null,
      "children": [{
          "name": "城市指导价",
          "value": "7.12",
          "unit": "%",
          "chainRadio": "0.32",
          "children": null
      }, {
          "name": "单均GMV",
          "value": "191.31",
          "unit": "%",
          "chainRadio": "6.32",
          "children": null
      }, {
          "name": "挂牌价",
          "value": "6.12",
          "unit": "%",
          "chainRadio": "-8.23",
          "children": null
      }, {
          "name": "单均毛利",
          "value": "1.69",
          "unit": "%",
          "chainRadio": "-29.83",
          "children": null
      }]
  }, {
      "name": "商圈单量",
      "value": "5580.0",
      "unit": "%",
      "chainRadio": "7.08",
      "children": [{
          "name": "到站司机",
          "value": "22345.0",
          "unit": "%",
          "chainRadio": "16.95",
          "children": null
      }, {
          "name": "新老用户订单",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "门店新用户",
              "value": "465.0",
              "unit": "%",
              "chainRadio": "29.17"
          }, {
              "name": "门店老用户",
              "value": "5115.0",
              "unit": "%",
              "chainRadio": "5.44"
          }]
      }, {
          "name": "车主类型",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "专快单量",
              "value": "4482.0",
              "unit": "%",
              "chainRadio": "12.93"
          }, {
              "name": "顺风车单量",
              "value": "648.0",
              "unit": "%",
              "chainRadio": "-21.55"
          }, {
              "name": "出租车单量",
              "value": "435.0",
              "unit": "%",
              "chainRadio": "12.11"
          }, {
              "name": "乘客端单量",
              "value": "0.0",
              "unit": "%",
              "chainRadio": "-"
          }, {
              "name": "其他来源",
              "value": "8.0",
              "unit": "%",
              "chainRadio": "-61.90"
          }, {
              "name": "代驾单量",
              "value": "7.0",
              "unit": "%",
              "chainRadio": "0.00"
          }]
      }]
  }, {
      "name": "城市单量",
      "value": "29305.0",
      "unit": "%",
      "chainRadio": "-18.36",
      "children": [{
          "name": "新老用户订单",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "门店新用户",
              "value": "2929.0",
              "unit": "%",
              "chainRadio": "-12.51"
          }, {
              "name": "门店老用户",
              "value": "26376.0",
              "unit": "%",
              "chainRadio": "-18.96"
          }]
      }, {
          "name": "车主类型",
          "value": null,
          "unit": null,
          "chainRadio": null,
          "children": [{
              "name": "专快单量",
              "value": "20883.0",
              "unit": "%",
              "chainRadio": "-17.72"
          }, {
              "name": "顺风车单量",
              "value": "5197.0",
              "unit": "%",
              "chainRadio": "-17.17"
          }, {
              "name": "出租车单量",
              "value": "3047.0",
              "unit": "%",
              "chainRadio": "-23.21"
          }, {
              "name": "乘客端单量",
              "value": "14.0",
              "unit": "%",
              "chainRadio": "-68.18"
          }, {
              "name": "其他来源",
              "value": "92.0",
              "unit": "%",
              "chainRadio": "-38.67"
          }, {
              "name": "代驾单量",
              "value": "72.0",
              "unit": "%",
              "chainRadio": "-7.69"
          }]
      }]
  }]
}

  var dataConversion = function (node) {
  if (!node || !node.children) { return; }
  var _queue = []; 
  _queue.push(node);
  while (_queue.length) {
    let _curNode = _queue.shift(); 
    //---------用户改写部分start---------
    if(!_curNode.series && (!!_curNode.value || !!_curNode.chainRadio)){
      _curNode.series = {};
      _curNode.series.data = [];
      _curNode.series.style = {};
      _curNode.series.style.fontColor = 'blue'
      _curNode.series.layout = {}
      _curNode.series.layout.col = 2
    }
    if(_curNode.value){
      const fontColor = _curNode.value > 200 ? 'pink' : 'gold'
      _curNode.series.data.push({ 
          value: _curNode.value,
          style:{
              fontColor: fontColor
          }
      })
    }
    if(_curNode.chainRadio){
      let fontColor, iconType, iconColor
      if(_curNode.chainRadio > 0){
          fontColor = 'red',
          iconType = 'caret-up',
          iconColor = 'skyblue'
      }
      else{
          fontColor = 'green',
          iconType = 'caret-down',
          iconColor = 'blue'
      }
      _curNode.series.data.push({ 
          value: _curNode.chainRadio,
          style: {
              fontColor: fontColor
          },
          appendIcon: {
              type: iconType,
              color: iconColor,
              location: 'before'
          }
      })
    }
    //---------用户改写部分end---------
    if (!!_curNode.children && _curNode.children.length) {
      _queue = _queue.concat(_curNode.children);
    }
  }
  return node;
}

const option = dataConversion(dataSource)
console.info(option)

ReactDOM.render(
  <div>
    <MindMap
      title="油站诊断"
      desc="点击可展开、收缩子节点"
      nodes = {nodes}    
      option = {option}
      expandDepth = {3}
    />
  </div>,
  mountNode);

````


