import React, { Component } from 'react';

class Homework extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }
//实现拖拽功能
componentDidMount() {
  const scope = this
  // 初始加载城市信息
  const { actions: { getCommonCitys } } = this.props
  getCommonCitys()
  this.onChangeHandler([{ rules: [], logicType: 'and' }])
  const dnd = {
    // 初始化
    init() {
      const me = this
      me.src = document.querySelector('#dragContainer')
      
      me.panelList = scope.refs.dragContainer
      
      // 为拖拽源监听dragstart,设置关联数据
      me.src.addEventListener('dragstart', me.onDragStart, false)

      // 拖拽鼠标移入元素,在拖放目标上设置视觉反馈
      me.panelList.addEventListener('dragenter', me.onDragEnter, false)

      // 取消元素dragover默认行为,使其可拖放
      me.panelList.addEventListener('dragover', me.onDragOver, false)

      // 拖拽移出元素,清除视觉反馈
      me.panelList.addEventListener('dragleave', me.onDragLeave, false)

      // 鼠标释放,在拖放目标上接收数据并处理
      me.panelList.addEventListener('drop', me.onDrop, false)
    },
    //当用户开始拖动一个元素或选中的文本时触发
    onDragStart(e) {
      const target = e.target
      e.dataTransfer.setData('text/plain', target.getAttribute('data-content'))
    },
    //当拖动元素或选中的文本到一个可释放目标时触发
    onDragEnter(e) {
      const target = e.target
      if (target.classList.contains('indicator-group') && (!target.lastElementChild ||
        (target.lastElementChild && !target.lastElementChild.classList.contains('add-region')))) {
        const divEl = document.createElement('div')
        divEl.classList.add('add-region')
        const childSpanEl = document.createElement('span')
        childSpanEl.appendChild(document.createTextNode('添加+'))
        divEl.appendChild(childSpanEl)
        target.appendChild(divEl)
      }
    },
    //当拖动元素或选中的文本离开一个可释放目标时触发
    onDragLeave(e) {
      const target = e.target
      if (target.classList.contains('indicator-group') && target.lastElementChild
      && target.lastElementChild.classList.contains('add-region')
      && !e.fromElement.classList.contains('indicator-group-item')) {
        const regionEl = target.querySelector('div[class^="add-region"]')
        target.removeChild(regionEl)
      }
    },
    //当元素或选中的文本被拖到一个可释放目标上时触发（每100毫秒触发一次）
    onDragOver(e) {
      e.preventDefault()
    },
    //当拖动元素或选中的文本时触发
    onDrop(e) {
      const data = e.dataTransfer.getData('text/plain')
      let target = e.target
      const { createdIndicators, currentTab } = scope.props
      const findPeak = (elem) => {
        if (elem && elem.getAttribute('data-level') == 'peak') {
          return elem
        }
        if (elem.nodeName.toLowerCase() == 'body') return undefined
        return findPeak(elem.parentElement)
      }
      const temp = findPeak(target)
      if (temp) {
        target = temp
      }
      if (target.classList.contains('indicator-group') && target.lastElementChild
      && target.lastElementChild.classList.contains('add-region')) {
        const regionEl = target.querySelector('div[class^="add-region"]')
        target.removeChild(regionEl)
      }
      if (target.classList.contains('indicator-group')) {
        const sequence = target.getAttribute('data-sequence')
        if (createdIndicators[sequence].rules.length == 5) {
          message.error('此分组标签最多只能添加五个')
          return
        }
        const temArr = Array.from(createdIndicators)
        const indicator = JSON.parse(data)
        // if (currentTab == '3') {}
        if (indicator.metricType == '3' || indicator.metricType == '5') {
          const flag = temArr[sequence].rules.every(item => item.metricType == '3' || item.metricType == '5')
          if (!flag) {
            message.error(`明细指标不能拖至${currentTab != '3' ? '画像' : '累计'}指标中`)
            return
          }
        } else {
          const flag = temArr[sequence].rules.some(item => item.metricType == '3' || item.metricType == '5')
          if (flag) {
            message.error(`${currentTab != '3' ? '画像' : '累计'}指标不能拖至明细指标中`)
            return
          }
        }
        const { bizLine } = indicator
        if (currentTab == '1') {
          indicator.storeTypes = [] // 容错
          if (bizLine == '159') { // 小桔加油
            indicator.storeTypes = [
              { name: '城市ID', value: '2' },
              { name: '油站ID', value: '4' },
            ]
            indicator.storeType = '4'
          } else if (bizLine == '187') { // 小桔养车
            indicator.storeTypes = [
              { name: '维保店ID', value: '1' },
              { name: '城市ID', value: '2' },
            ]
            indicator.storeType = '1'
          } else if (bizLine == '153') { // 共享汽车
            indicator.storeTypes = [
              { name: '城市ID', value: '2' },
              { name: '场站ID', value: '3' },
            ]
            indicator.storeType = '3'
          }
        } else if (currentTab == '3') {
          if (bizLine == '159') {
            indicator.storeTypes = [
              { name: '油站ID', value: '4' },
            ]
            indicator.storeType = '4'
          } else if (bizLine == '187') {
            indicator.storeTypes = [
              { name: '维保店ID', value: '1' },
            ]
            indicator.storeType = '1'
          } else if (bizLine == '153') {
            indicator.storeTypes = [
              { name: '场站ID', value: '3' },
            ]
            indicator.storeType = '3'
          }
        }
        //通过symbolType属性设置选择条件
        if (indicator.symbolType == '2' || indicator.symbolType == '3' || indicator.symbolType == '4') {
          indicator.symbol = scope.equalAndNoSymbol[0].value
        } else if(indicator.symbolType == '3'){
          indicator.symbol = '7'
        }else if (indicator.symbolType == '6') {
          indicator.symbol = scope.equalSymbol[0].value
        } else if (indicator.symbolType == '7') {
          indicator.symbol = scope.allSymbol[3].value
        } else {
          indicator.symbol = scope.allSymbol[0].value
        }
        temArr[sequence].rules.push(indicator)
        scope.onChangeHandler(temArr)
      }
    },

  }

  dnd.init()
  // document.querySelector('.create-indicator-container').style.height =
  // getComputedStyle(document.querySelector('.source-indicator-container')).height
}
  //在另一侧需要设置可拖拽的属性draggable




  //下载文件
  downloadPointUrl = (record) => {
    const targerUrl = `/api/user-tag/download?tagId=${record && (record.userTagId)}`
    const aEl = document.createElement('a')
    aEl.href = targerUrl
    aEl.style.display = 'none'
    document.body.appendChild(aEl)
    aEl.click()
    document.body.removeChild(aEl)
  }

  renderCreatedIndicators=({ indicators, groupLogicType }) => {
    return indicators.map((item, index) => (
      (
        [(index + 1) % 2 == 0 && <Col span={2}>
          {index >= 1 &&
        <div className="panel-logic panel-item">
          {groupLogicType == 'and' ? '且' : '或'}
        </div>}
        </Col>,
        <Col span={11}>
          <div
            key={index.toString()}
            className="panel-item"
          >
            <div className="indicator-group" data-sequence={index} data-level="peak">
              {this.renderCreatedGroupIndicators(item.rules, index + 1)}
            </div>
          </div>
        </Col>]
      )))
  }
  renderCreatedGroupIndicators = (indicators, sequence) => indicators.map((item, index) => {
    const {
      metricNameZh,
      symbolType,
      metricValue,
      metricType,
      symbol,
      value,
      logicType,
      storeId,
      mark,
      symbolType1,
    } = item
    let storeType
    if (storeId) {
      storeType = (storeId.length > 6 ? '0' : '1')
    }
    return (<div className="indicator-group-item" key={index.toString()}>
      {index == 0 && <Bubble num={sequence} />}
      {index >= 1 &&
        <span>{logicType == 'and' ? '且' : '或'}</span>
      }
      <span>{metricNameZh}</span>

      {
        (symbolType == '3') &&
        <span>为</span>
      }
      {
        symbolType !== '3' && symbolType !== '7' &&
        this.renderOperators(symbolType, symbol) && <span>{this.renderOperators(symbolType, symbol)}</span>
      }

      {(metricType == '1' || metricType == '4') &&
         [(symbolType == '1' || symbolType == '2' || symbolType == '7') &&
          metricValue && <span>{metricValue}</span>,
         symbolType == '5' && <span>{moment(metricValue * 1000).format('YYYY/MM/DD HH:mm:ss') }</span>,
         symbolType == '3' && <span>城市名称为</span>,
         (symbolType == '3' || symbolType == '4') &&
          mark &&
          <Tooltip
            placement="top"
            title={[
              <p>{Object.entries(mark).map(markItem => markItem[1]).join(',')}</p>,
            ]}
          >
            <span className="city-names">{Object.entries(mark).map(markItem => markItem[1]).join(',')}</span>
          </Tooltip>,
         symbolType == '6' && 
          metricValue && <span>
           {Array.isArray(metricValue) && metricValue.find(metric => metric.id == value).name}</span>
         ]
      }
      {(metricType == '2' || metricType == '6') &&
        [metricValue && <span>
          {Array.isArray(metricValue) && metricValue.find(metric => metric.id == value).name}</span>,
        mark && mark.storeName && <span>{mark.storeName}</span>,
        symbolType == '7' && value && <span>{value} 公里范围内</span>]
      }
      {(metricType == '3' || metricType == '5') &&
        [
          symbolType1 == '5' && <span>{moment(metricValue * 1000).format('YYYY/MM/DD HH:mm:ss') } </span>,
          symbolType1 !== '5' && <span>{metricValue}</span>,
          <span>且</span>,
          this.storeTypes[storeType] && this.storeTypes[storeType].name &&
          <span>{this.storeTypes[storeType].name}</span>,
          symbolType == '3' &&
            [
              <span>城市名称为</span>,
              <span>{mark && <span>{Object.keys(mark) && mark[Object.keys(mark)[0]]}</span>}</span>,
            ],
          symbolType == '4' && (
            [
              <span>门店为</span>,
              <span>{mark && <span>{mark.storeName}</span>}</span>,
            ]
          ),
        ]
      }
    </div>)
  },
  )

  render() {
    const groupIndicators = detail && detail.ruleInfo && this.parseRuleInfo(detail.ruleInfo)
    return (
      <div ref="dragContainer" className="create-indicator-container">

        <p>如廊作业</p>
        <Button size='small' type="primary" onClick={() => {this.downloadPointUrl(record)}}>点击下载</Button>
        {
          record && record.ruleInfo &&
          <section className="basic-info-container">
            <TitleNav title="圈选指标明细" />
            <Row>
              {groupIndicators && this.renderCreatedIndicators(groupIndicators)}
            </Row>
          </section>
        }
      </div>
    );
  }
}

export default Homework;

