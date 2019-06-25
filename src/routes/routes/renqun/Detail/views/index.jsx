import React, { Component } from 'react'
import {
  Row,
  Col,
  Button,
  Form,
  Popconfirm,
  Tooltip,
  // Input,
} from 'antd'
import moment from 'moment'
import T from 'prop-types'
import {
  connect,
} from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  PageTitle,
  Bubble,
} from '@components'
//import * as actions from '../../actions/crowdTag'
import { actions } from '@modules/CrowdTag'
import { actions as commonActions } from '@modules/Common'
import TitleNav from './TitleNav/'
// import IndicatorCard from './IndicatorCard/'
import BasicInfo from './BasicInfo'
import './index.styl'

class UserGroupDetail extends Component {

  static propTypes ={
    match: T.object.isRequired,
    actions: T.object.isRequired,
    detail: T.object.isRequired,
    // commonCitys: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    console.log('详情中获取的this.props')
    console.log(this.props)
    this.state = { index: 0 }
    this.equalAndNoSymbol = [
      { name: '=', value: '1' },
      { name: '!=', value: '2' },
    ]
    this.allSymbol = [
      { name: '>', value: '4' },
      { name: '<', value: '3' },
      { name: '>=', value: '6' },
      { name: '<=', value: '5' },
      { name: '=', value: '1' },
      { name: '!=', value: '2' },
      { name: 'IN', value: '7' },
      { name: 'Between', value: '8' },
    ]
    this.storeTypes = [
      { name: '门店ID', value: '1' },
      { name: '城市ID', value: '2' },
    ]
    this.storesHash = {
      '1': '维保店ID',
      '2': '城市ID',
      '3': '场站ID',
      '4': '油站ID',
    }
  }

  componentDidMount() {
    const {
      match: { params: { id } },
      actions: { fetchUserTagDetail },
    } = this.props
    if (id) {
      fetchUserTagDetail({ userTagId: id })
    }
    const { actions: { getCommonCitys } } = this.props
    getCommonCitys()
  }

  parseRuleInfo = (ruleInfo) => {
    console.log("查看拿到的数据")
    console.log(ruleInfo)
    // const { commonCitys } = this.props
    // let citysArr
    // if (commonCitys) {
    //   citysArr = Object.entries(commonCitys).map(item => item[1]).reduce((a, b) => a.concat(b))
    // }
    ruleInfo = JSON.parse(ruleInfo)
    const logicType = ruleInfo.logicType
    const data = ruleInfo.items.map((item) => {
      //console.info(item)
      const {
        source,
      } = item
      return {
        metricType: source,
        logicType: item.logicType,
        rules: (source == '3' ||  source == '5') ?
          (item.rules.map((subItem) => {
            const rules = subItem.rules
            // let storeId = ''
            // if (rules[0].symbolType == 3) { // 城市控件
            //   storeId = citysArr.filter((cityItem) => {
            //     const ids = rules[0].value.split(',')
            //     return ids.some(idsItem => idsItem == cityItem.id)
            //   }).map(cityItem => cityItem.name).join(',')
            // } else {
            //   storeId = rules[0].value
            // }
            const mark = rules[0].mark && JSON.parse(rules[0].mark)
            return {
              metricId: rules[1].id, // 随便搞的
              metricName: rules[1].name,
              symbol: rules[1].symbol,
              symbolType: rules[0].symbolType,
              symbolType1: rules[1].symbolType,
              metricValue: rules[1].value,
              value: rules[0].value,
              mark,
              metricNameZh: rules[1].alias,
              metricDescription: rules[1].description,
              metricType: source,
              storeIDType: rules[2].value,
              logicType: item.logicType,
            }
          })) :
          (item.rules.map((subItem) => {
            let metricValue
            if (subItem.source == '2' || subItem.source == '6' || subItem.source == '4') {
              if(Array.isArray(subItem.enumValues)){
                metricValue = subItem.enumValues
              }else{
                metricValue = subItem.value
              }
            } else {
              metricValue = subItem.value
            }
            // if (subItem.symbolType == 3) { // 城市控件
            //   metricValue = citysArr.filter((cityItem) => {
            //     const ids = subItem.value.split(',')
            //     return ids.some(idsItem => idsItem == cityItem.id)
            //   }).map(cityItem => cityItem.name).join(',')
            // }
            const mark = subItem.mark && JSON.parse(subItem.mark)
            return {
              metricId: subItem.id,
              metricName: subItem.name,
              symbolType: subItem.symbolType,
              metricNameZh: subItem.alias,
              logicType: item.logicType,
              metricDescription: subItem.description,
              metricValue,
              value: subItem.value,
              symbol: subItem.symbol,
              metricType: subItem.source,
              mark,
            }
          })),
      }
    })
    return { indicators: data, groupLogicType: logicType }
  }
  renderOperators = (type, symbol) => {
    // let symbolTypes = this.allSymbol
    // if (type == 2 || type == 3 || type == 4) {
    //   symbolTypes = this.equalAndNoSymbol
    // } else {
    //   symbolTypes = this.allSymbol
    // }
    const cur = this.allSymbol.find(({ value }) => value == symbol)
    return cur && cur.name
  }
  renderCreatedGroupIndicators = (indicators, sequence) => indicators.map((item, index) => {
    const {
      metricNameZh,
      // metricDescription,
      symbolType,
      metricValue,
      metricType,
      // detailStores,
      // citys,
      symbol,
      value,
      logicType,
      storeId,
      mark,
      symbolType1,
      // storeIDType,
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
          // symbolType == 4 &&
          // <span>{value}</span>,
        ]
      }
    </div>)
  },
  )
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
  render() {
    const { detail } = this.props
    const groupIndicators = detail && detail.ruleInfo && this.parseRuleInfo(detail.ruleInfo)
    const record = detail
    return (
      <div className="user-group-detail-page">
        <PageTitle
          titles={['人群包', '人群包详情']}
        />
        <section className="basic-info-container">
          <TitleNav title="基本信息" />
          <Row>
            <Col span={20}>
              <BasicInfo data={detail} />
            </Col>
            <Col span={12}>
              <div className="operator-container">
                <div className="operate-btns" style={{ display: 'block' }}>
                  {
                    (
                      ((record.type && record.type.id == '1' && // 离线标签筛选
                      record.status && (record.status.id == '2' || record.status.id == '3'))
                      ||
                      (record.type && record.type.id == '2') // 上传标签筛选
                      ||
                      (record.type && record.type.id == '4') // 实时标签筛选
                      )
                    )
                    && <Popconfirm
                      title="确定要删除吗？"
                      onConfirm={() => { this.deleteGroup(record) }}
                    >
                      <Button type="simple">删除</Button>
                    </Popconfirm>
                  }
                </div>
              </div>
            </Col>
          </Row>
        </section>
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
    )
  }
}

export default connect(
  state => ({
    detail: state.crowdTag.detail.data,
    commonCitys: state.common.citys.data,
  }),
  dispatch => ({ actions: bindActionCreators({ ...actions, ...commonActions }, dispatch) }),
)(Form.create()(UserGroupDetail))

