import React, { Component } from 'react'
import T from 'prop-types'
import {
  Button,
  Icon,
  message,
  Select,
  Input,
  Tooltip,
  DatePicker,
} from 'antd'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import {
  connect,
} from 'react-redux'
import { Bubble } from '@components'
import SelectBiz from './SelectBiz'
import SelectCity from './SelectCity'
import { actions } from '@modules/CrowdTag'
import { actions as commonActions } from '@modules/Common'
import './index.styl'

const Option = Select.Option
//let editLoadedFlag = false
let editStorageMsg = ''
class AddIndicators extends Component {
  static defaultProps = {
    data: [],
    choosedIds: [],
    onClick: () => {},
  }
  static propTypes = {
    // currentCategory: T.string.isRequired,
    actions: T.object.isRequired,
    createdIndicators: T.array.isRequired,
    groupLogicType: T.string.isRequired,
    curentTemplate: T.number.isRequired,
    templates: T.object.isRequired,
    // bizLine: T.string.isRequired,
    curentTemplateTick: T.number.isRequired,
    currentTab: T.string.isRequired,
    idType: T.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.equalAndNoSymbol = [
      { name: '=', value: '1' },
      { name: '!=', value: '2' },
    ]
    this.equalSymbol = [
      { name: '=', value: '1' },
    ]
    this.allSymbol = [
      { name: '=', value: '1' },
      { name: '!=', value:'2' },
      { name: '<', value: '3' },
      { name: '>', value: '4' },
      { name: '<=', value: '5' },
      { name: '>=', value: '6' },
    ]
    this.detailSymbol = [ 
      { name: '=', value: '1' },
      { name: '>', value: '4' },
      { name: '<=', value: '5' },
    ]
    this.storeTypes = [
      { name: '门店ID', value: '1' },
      { name: '城市ID', value: '2' },
    ]
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
  
  componentWillUnmount(){
    editStorageMsg = ''
  }
  componentWillReceiveProps(nextProps) {
    const { curentTemplate, templates, curentTemplateTick, curentEditMsg} = nextProps
    if (curentTemplateTick !== this.props.curentTemplateTick) {
      const { items = [] } = templates
      const ruleInfo = JSON.parse(items[curentTemplate].ruleInfo)
      const logicType = ruleInfo.logicType
      const data = ruleInfo.items.map((item) => {
        const {
          source,
          logicType
        } = item
        return {
          metricType: source,
          logicType: logicType,
          rules: (item.source === '3' || source === '5') ?
            (item.rules.map((subItem) => {
              const rules = subItem.rules
              let citys
              let storeType
              let detailStores
              if (subItem.rules[0].symbolType === '3') { // 城市控件
                citys = rules[0].mark && JSON.parse(rules[0].mark)
                storeType = '2'
              } else if (subItem.rules[0].symbolType === '4') {
                detailStores = rules[0].mark && JSON.parse(rules[0].mark)
              }
              let storeTypes
              if (subItem.rules[2] && subItem.rules[2].mark) {
                storeTypes = JSON.parse(rules[2].mark)
                storeType = storeTypes.find(storeTypesItem => subItem.rules[2].value === storeTypesItem.value).value
              }
              return {
                metricId: rules[1].id, // 随便搞的
                metricName: rules[1].name,
                symbol: (rules[1].symbol).toString(),
                symbolType: rules[1].symbolType,
                metricValue: rules[1].value,
                storeId: rules[0].value,
                metricNameZh: rules[1].alias,
                logicType: item.logicType,
                metricDescription: rules[1].description,
                valueType: rules[1].valueType,
                metricType: item.source,
                bizLine: rules[1].bizLine,
                storeType,
                storeTypes,
                detailStores,
                citys,
              }
            })) :
            (item.rules.map((subItem) => {
              let metricValue
              if (subItem.source === '2' || subItem.source === '4') {
                metricValue = subItem.enumValues
              }
              let citys
              if (subItem.symbolType === '3') { // 城市控件
                citys = subItem.mark && JSON.parse(subItem.mark)
              }
              let detailStores
              if (subItem.symbolType === '7') { // 门店控件
                detailStores = subItem.mark && JSON.parse(subItem.mark)
              }
              return {
                metricId: subItem.id,
                metricName: subItem.name,
                symbolType: subItem.symbolType,
                metricNameZh: subItem.alias,
                logicType: item.logicType,
                metricDescription: subItem.description,
                valueType: subItem.valueType,
                metricValue: metricValue || subItem.value,
                symbol: (subItem.symbol).toString(),
                metricType: subItem.source,
                value: subItem.value,
                bizLine: subItem.bizLine,
                citys,
                detailStores,
              }
            })),
        }
      })
      this.onChangeHandler(data, logicType)
    }
    if ((curentEditMsg !== 'undefined') && (curentEditMsg !== undefined) && (curentEditMsg !== 'null') ) {
      if (curentEditMsg !== editStorageMsg){
        editStorageMsg = curentEditMsg
        const ruleInfo = JSON.parse(curentEditMsg)
        const logicType = ruleInfo.logicType
        //console.log(curentEditMsg)
        const data = ruleInfo.items.map((item) => {
          const {
            source,
            logicType
          } = item
          return {
            metricType: source,
            logicType: logicType,
            rules: (item.source === '3' || source === '5' ) ?
              (item.rules.map((subItem) => {
                const rules = subItem.rules
                let citys
                let storeType
                let detailStores
                if (subItem.rules[0].symbolType === '3') { // 城市控件
                  citys = rules[0].mark && JSON.parse(rules[0].mark)
                  storeType = '2'
                } else if (subItem.rules[0].symbolType === '4') {
                  detailStores = rules[0].mark && JSON.parse(rules[0].mark)
                }
                let storeTypes
                if (subItem.rules[2] && subItem.rules[2].mark) {
                  storeTypes = JSON.parse(rules[2].mark)
                  storeType = storeTypes.find(storeTypesItem => subItem.rules[2].value == storeTypesItem.value).value
                }
                return {
                  metricId: rules[1].id, // 随便搞的
                  metricName: rules[1].name,
                  symbol: (rules[1].symbol).toString(),
                  symbolType: rules[1].symbolType,
                  metricValue: rules[1].value,
                  storeId: rules[0].value,
                  metricNameZh: rules[1].alias,
                  logicType: item.logicType,
                  metricDescription: rules[1].description,
                  valueType: rules[1].valueType,
                  metricType: item.source,
                  bizLine: rules[1].bizLine,
                  storeType,
                  storeTypes,
                  detailStores,
                  citys,
                }
              })) :
              (item.rules.map((subItem) => { 
                let metricValue
                if (subItem.source === '2' || subItem.source === '4' || subItem.source === '6') {
                  metricValue = subItem.enumValues
                }
                let citys
                if (subItem.symbolType === '3') { // 城市控件
                  citys = subItem.mark && JSON.parse(subItem.mark)
                }
                let detailStores
                if (subItem.symbolType === '7') { // 门店控件
                  detailStores = subItem.mark && JSON.parse(subItem.mark)
                }
                return {
                  metricId: subItem.id,
                  metricName: subItem.name,
                  symbolType: subItem.symbolType,
                  metricNameZh: subItem.alias,
                  logicType: item.logicType,
                  metricDescription: subItem.description,
                  valueType: subItem.valueType,
                  metricValue: metricValue || subItem.value,
                  symbol: (subItem.symbol).toString(),
                  metricType: subItem.source,
                  value: subItem.value,
                  bizLine: subItem.bizLine,
                  citys,
                  detailStores,
                }
              })),
          }
        })
        this.onChangeHandler(data, logicType)
      }
      
    }
    
  }
  //指标显示更新  统一数据格式 并过redux
  onChangeHandler = (data, groupLogicTypeC) => {
    const {
      actions: {
        setUserTagCreatedIndicators,
      },
      groupLogicType,
    } = this.props
    let newarr = []
    for (let i = 0; i < data.length; i++) {
      newarr = newarr.concat(data[i].rules)
    }

    let choosedIds = newarr.map(item => item.metricId)
    choosedIds = new Set(choosedIds)
    choosedIds = Array.from(choosedIds)
    setUserTagCreatedIndicators({
      createdIndicators: data,
      choosedIds,
      groupLogicType: groupLogicTypeC || groupLogicType,
    })
  }
  handleBizChange = (sequence, index, fieldName, value) => {
    if (fieldName == 'detailStores') {
      this.baseHander(sequence, index, 'storeId', value.storeId)
    }
    this.baseHander(sequence, index, fieldName, value)
  }
  handleCityChange = (sequence, index, fieldName, value) => {
    this.baseHander(sequence, index, fieldName, value)
  }
  inputOnChangeHandler = (sequence, index, fieldName, value) => {
    this.baseHander(sequence, index, fieldName, value)
  }
  baseHander = (sequence, index, fieldName, value) => {
    const { createdIndicators } = this.props
    const temArr = Array.from(createdIndicators)
    temArr[sequence - 1].rules[index][fieldName] = value
    this.onChangeHandler(temArr)
  }
  removeIndicatorGroupItem=(sequence, index) => {
    const { createdIndicators } = this.props
    const temArr = Array.from(createdIndicators)
    const rules = temArr[sequence - 1].rules
    rules.splice(index, 1)
    this.onChangeHandler(temArr)
    if (rules.length == 0) {
      this.removeIndicatorGroup(sequence - 1)
    }
  }
  //删除标签组
  removeIndicatorGroup=(sequence) => {
    const { createdIndicators } = this.props
    const temArr = Array.from(createdIndicators)
    temArr.splice(sequence, 1)
    this.onChangeHandler(temArr)
  }
  //增加标签组
  addIndicatorGroup =() => {
    const { createdIndicators } = this.props
    console.log(createdIndicators)
    if (createdIndicators.length != 0 && createdIndicators[createdIndicators.length - 1].rules.length == 0) {
      message.error('有分组为空！')
      return
    }
    if (createdIndicators.length >= 10) {
      message.error('分组不能超过十个！')
      return
    }
    const temArr = Array.from(createdIndicators)
    temArr.push({ rules: [], logicType: 'and' })
    this.onChangeHandler(temArr)
  }
  
  selectOnchangeHandler = (sequence, index, fieldName, value) => {
    if (fieldName == 'logicType') {
      const { createdIndicators } = this.props
      const temArr = Array.from(createdIndicators)
      temArr[sequence - 1][fieldName] = value
      this.onChangeHandler(temArr)
    } else {
      this.baseHander(sequence, index, fieldName, value)
    }
  }

  selectGroupOnchangeHandler = (value) => {
    const { createdIndicators } = this.props
    const temArr = Array.from(createdIndicators)
    this.onChangeHandler(temArr, value)
  }

  disabledDate = current => current && current.valueOf() > Date.now() // 限制DatePicker控件时间选择
  //指标中的添加条件
  renderCreatedIndicators = (data) => {
    //let data = JSON.parse(data)
    const { groupLogicType } = this.props
    //console.log(groupLogicType)//and
    return data.map((item, index) => (
      [index >= 1 &&
      <div style={{ display: 'block' }}>
        <Select
          defaultValue="or"
          size="small"
          style={{ width: 50 }}
          value={groupLogicType}
          onChange={(value) => {
            this.selectGroupOnchangeHandler(value)
          }}
        >
          <Option value="or">或</Option>
          <Option value="and">且</Option>
        </Select>
      </div>,
      <div
        key={index.toString()}
        className="panel-item"
      >
        <div className="indicator-group" data-sequence={index} data-level="peak">
          {this.renderCreatedGroupIndicators(item.rules, index + 1)}
        </div>
        <Icon type="minus-square-o" onClick={() => { this.removeIndicatorGroup(index) }} />
      </div>]

    ))
  }
  //渲染指标
  renderCreatedGroupIndicators = (indicators, sequence) => indicators.map((item, index) => {
    const {
      metricNameZh,
      metricDescription,
      symbolType,
      metricValue,
      metricType,
      storeType = '1',
      detailStores,
      citys,
      metricValueSelect,
      value,
      bizLine,
      // storeId,
    } = item
    const { createdIndicators = {} } = this.props
    const {
      logicType = 'and',
    } = createdIndicators[sequence - 1]
    return (<div className="indicator-group-item" key={index.toString()}>
      {index == 0 && <Bubble num={sequence} />}
      {index >= 1 &&
      <Select
        defaultValue="or"
        size="small"
        style={{ width: 50 }}
        value={logicType}
        onChange={
          value1 => this.selectOnchangeHandler(sequence, index, 'logicType', value1)
        }
      >
        <Option value="and">且</Option>
        <Option value="or">或</Option>
      </Select>}
      <Tooltip
        placement="top"
        title={[
          <p>{metricNameZh}</p>,
        ]}
      >
        <span
          style={{
            display: 'inline-block',
            maxWidth: '9em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' }}
        >{metricNameZh}</span>
      </Tooltip>
      <Tooltip
        placement="top"
        title={[
          <p>{metricDescription}</p>,
        ]}
      >
        <Icon type="question-circle-o" />
      </Tooltip>
      {
        (symbolType == '3' || symbolType == '4') &&
        <span>为</span>
      }
      {
        symbolType != '3' && symbolType != '4' && symbolType != '7' &&
        <Select
          size="small"
          style={{ width: 55 }}
          value={(item.symbol).toString()}
          onChange={(value1) => {
            this.selectOnchangeHandler(sequence, index, 'symbol', value1)
          }}
        >
          {this.renderOperators(symbolType, metricType)}
        </Select>
      }
      
      {(item.metricType == '1' || item.metricType == '4') &&
        [item.symbolType != '3' && item.symbolType != '5' && item.symbolType != '6' &&
          <Input
            size="small"
            style={{ width: 100 }}
            value={metricValue}
            onChange={(e) => {
              this.inputOnChangeHandler(sequence, index, 'metricValue', e.target.value)
            }}
          />,
        item.symbolType == '3' &&
          <SelectCity
            bizLine={bizLine}
            value={citys}
            onChange={value1 => this.handleCityChange(sequence, index, 'citys', value1)}
          />,
        item.symbolType == '5' &&
          <DatePicker
            style={{ width: '100px' }}
            value={metricValue && moment(metricValue * 1000)}
            onChange={(date) => {
              this.inputOnChangeHandler(sequence, index, 'metricValue',
                (new Date(`${date.format('l')} 00:00:00`).getTime() / 1000))
            }}
          />,
        item.symbolType == '6' &&
        <Select
          size="small"
          style={{ width: 140 }}
          value={metricValueSelect || value}
          onChange={value1 => this.selectOnchangeHandler(sequence, index, 'metricValueSelect', value1)}
        >
          {metricValue && metricValue.map(metricValueItem => (
            <Option value={metricValueItem.id}>{metricValueItem.name}</Option>
          ))}
        </Select>
        ]
      }
      {(item.metricType === '2' || item.metricType === '6') &&
        (item.symbolType === '7' ?
          [
            <SelectBiz
              bizLine={bizLine}
              value={detailStores}
              onChange={value1 => this.handleBizChange(sequence, index, 'detailStores', value1)}
            />,
            <Input
              size="small"
              style={{ width: 100 }}
              value={metricValue}
              type="number"
              placeholder="范围为1～10"
              onChange={(e) => {
                const targetValue = e.target.value
                if (targetValue != '') {
                  if (targetValue > 10 || targetValue <= 0) {
                    e.preventDefault()
                    message.error('常驻地公里范围为1～10Km')
                    return
                  }
                }
                this.inputOnChangeHandler(sequence, index, 'metricValue', targetValue)
              }}
            />,
            <span>公里范围内</span>,
          ]
          :
          <div>
            {item.symbolType !== '1' &&
              <Select
                size="small"
                style={{ width: 140 }}
                value={metricValueSelect || value}
                onChange={value1 => this.selectOnchangeHandler(sequence, index, 'metricValueSelect', value1)}
              >
                {metricValue && metricValue.map(metricValueItem => (
                  <Option value={metricValueItem.id}>{metricValueItem.name}</Option>
                ))}
              </Select>
            }
            {
              item.symbolType === '1' &&
              <Input
                size="small"
                style={{ width: 100 }}
                value={metricValue}
                onChange={(e) => {
                  this.inputOnChangeHandler(sequence, index, 'metricValue', e.target.value)
                }}
              />
            }
          </div>)
      }
      {(metricType == '3' || metricType == '5') &&
        [
          item.symbolType == '5' &&
          <DatePicker
            style={{ width: 100 }}
            value={metricValue && moment(metricValue * 1000)}
            onChange={(date) => {
              this.inputOnChangeHandler(sequence, index, 'metricValue',
                (new Date(`${date.format('l')} 00:00:00`).getTime() / 1000))
            }}
          />,
          item.symbolType != '5' &&
          <Input
            size="small"
            style={{ width: 100 }}
            value={metricValue}
            onChange={(e) => {
              this.inputOnChangeHandler(sequence, index, 'metricValue', e.target.value)
            }}
          />,
          '且',
          <Select
            size="small"
            style={{ width: '90px ' }}
            value={storeType}
            onChange={value1 => this.selectOnchangeHandler(sequence, index, 'storeType', value1)}
          >
            {item.storeTypes.map(storeItem => (
              <Option value={storeItem.value}>{storeItem.name}</Option>
            ))}
          </Select>,
          (storeType == '2' ?
            <SelectCity
              value={citys}
              bizLine={bizLine}
              mode="single"
              onChange={value1 => this.handleCityChange(sequence, index, 'citys', value1)}
            /> :
            ['等于',
              <SelectBiz
                value={detailStores}
                bizLine={bizLine}
                onChange={value1 => this.handleBizChange(sequence, index, 'detailStores', value1)}
              />,
              // currentTab == '3' && <span className="store-selector-tip">门店ID等于0表示不限制门店</span>,
            ]
          ),
        ]
      }
      <Icon type="minus-square-o" onClick={() => { this.removeIndicatorGroupItem(sequence, index) }} />
    </div>)
  },
  )
  //操作判断（symbolType, metricType）
  renderOperators = (type, metricType) => {
    let symbolTypes = []
    const { currentTab } = this.props
    if (type == '2' || type == '3' || type == '4') {
      symbolTypes = this.equalAndNoSymbol
    } else if (type == '6') {
      symbolTypes = this.equalSymbol
    } else {
      symbolTypes = this.allSymbol
    }
    if ((metricType == '3' || metricType == '5') && currentTab == '1') {
      symbolTypes = this.detailSymbol
    }
    return symbolTypes.map(item => (
      <Option value={item.value}>{item.name}</Option>
    ))
  }
  render() {
    const {
      createdIndicators,
      actions: { setTemplateModelVisable },
      currentTab,
    } = this.props
    console.log("传入组件时的数据")
    console.log(createdIndicators)
    //console.log(createdIndicators)//createdIndicators是拖拽到指定区域的数值
    return (
      <div ref="dragContainer" className="create-indicator-container">
        <div className="tip-template">
          {/* <p>{this.props.msg}</p> */}
          <span>Tips：选择多组指标圈人，每一组可拖动添加多个指标</span>
          {(currentTab === '1' || currentTab === '3') &&
          <Button
            type="primary"
            size="small"
            onClick={() => {
              const {
                actions: { fetchUserTagTemplates },
                idType,
              } = this.props
              fetchUserTagTemplates({
                pageIndex: 0,
                pageSize: 10,
                idType,
                templateType: currentTab == '1' ? 1 : 2,
              })
              setTemplateModelVisable(true)
            }}
          >使用模版创建</Button>
          }
        </div>
        {this.renderCreatedIndicators(createdIndicators)}
        <Icon
          type="plus-square-o"
          className="group-add-btn-icon"
          onClick={() => {
            this.addIndicatorGroup()
          }}
        />
      </div>
    )
  }
}
export default connect(
  state => ({
    category: state.crowdTag.category,
    currentCategory: state.crowdTag.currentCategory,
    indicators: state.crowdTag.indicators,
    createdIndicators: state.crowdTag.createdIndicatorsData.createdIndicators,
    groupLogicType: state.crowdTag.createdIndicatorsData.groupLogicType,
    createdIndicatorsData: state.crowdTag.createdIndicatorsData,
    templates: state.crowdTag.templates.data,
    curentTemplate: state.crowdTag.curentTemplate.current,
    curentTemplateTick: state.crowdTag.curentTemplate.tick,
    bizLine: state.crowdTag.bizLine,
    commonCitys: state.common.citys.data,
    currentTab: state.crowdTag.currentTab,
    idType: state.crowdTag.idType,
  }),
  dispatch => ({ actions: bindActionCreators({ ...actions, ...commonActions }, dispatch) }),
)(AddIndicators)
