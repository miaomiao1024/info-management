import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Table,
  Row,
  Col,
  Form,
  Tooltip,
} from 'antd'
import T from 'prop-types'
import {
  datef
} from '@didi/fate-common'
import './index.styl'
import PushCard from './PushCard'
import MobileDisplay from '../../Create/views/PushChannel/PushText/MobileDisplay'
import { actions } from '@modules/PushCenter'
// import SelectDocModal from '../CreatePushCenter/SelectDocTag/SelectDocModal'
import SelectDocModal from '../../Create/views/SelectDocTag/SelectDocModal'

import {
  PUSH_TOOL_RULE_MAP,
  PUSH_TOOL_ROLE_MAP,
  PUSH_TOOL_LOCATION_RULE_MAP,
  PUSH_TOOL_RULE_DETAIL_MAP
} from '../../../configs'
import {
  PageTitle,
  ModuleTitle,
} from '@components'

const {
  formatDateFromMS,
  formatDate,
} = datef
class PushDetail extends Component {
  static propTypes = {
    match: T.object.isRequired,
    detail: T.object.isRequired,
    actions: T.object.isRequired,
    userTagInfo: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      moreRecords: false,  // 操作记 
    }
  }
  componentWillMount() {
    const { fetchPushToolDetail } = this.props.actions
    //const { actions : { getPushDetailDataAsync } } = this.props
    const {
      id,
    } = this.props.match.params
    fetchPushToolDetail({ activityId: id })
    //getPushDetailDataAsync({ activityId: id })
  }

  render() {
    const title = ['推送中心', '推送活动详情']
    const { detail, userTagInfo ,userTagPackge} = this.props
    const data = detail.data || {}
    const mobileTitle = data.bizLineName
    const taskList = data.taskList || []
    console.log(taskList)
    const recordList = data.recordList || []
    const userTagInfoDS = userTagInfo.data && userTagInfo.data.items ? userTagInfo.data.items : []
    const userTagPackgeDS = userTagPackge.data && userTagPackge.data.items ? userTagPackge.data.items : []
    const storeDetails = data.storeDetails || []
    const colNameSpan = {
      span: 4,
    }
    const colValueSpan = {
      span: 12,
    }
    const columns = [{
      title: '标签ID',
      key: 'tagId',
      render: (text, record) => (record.tagId && record.tagId) || '--',
    }, {
      title: '标签名称',
      key: 'tagName',
      render: (text, record) => (record.tagName && record.tagName) || '--',
    }, {
      title: '标签类型',
      key: 'tagType',
      render: (text, record) => (record.type && record.type.name) || '--',
    }, {
      title: '用户数',
      dataIndex: 'actualUserCount',
      render: (text, record) => `${record.type.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: (text, record) => `${record.creatorNameZh || ''}`,
    }, {
      title: '创建/更新时间',
      key: 'createTime',
      render: (text, record) => `${record.createTime}`,
    }, {
      title: '最近使用时间',
      key: 'operateTime',
      render: (text, record) => `${record.operateTime}`,
    }, {
      title: '人群包状态',
      key: 'status',
      render: (text, record) => `${(record.status && record.status.name) || '--'}`,
    }]
    const oilColumns = [{
      title: '油站名称',
      dataIndex: 'storeName',
      className: 'store-name',
      render: text =>
        (
          <div>
            <Tooltip placement="top" title={text}>
              <p>{text}</p>
            </Tooltip>
          </div>),
    }, {
      title: '油站地址',
      dataIndex: 'storeAddress',
      className: 'store-address',
      render: text =>
        (
          <div>
            <Tooltip placement="top" title={text}>
              <p>{text}</p>
            </Tooltip>
          </div>),
    }, {
      title: '上线时间',
      dataIndex: 'onlineTime',
      render: (value) => {
        if (value === 'null') {
          return '-'
        }
        return formatDate(value)
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      render: status => (status === 1 ? '营业中' : '暂停营业'),
    }]
    return (
      <div className="push-tool-detail-page">
        <PageTitle titles={title} />
        {userTagInfoDS.length > 0 && data.pushRule && data.pushRule === '1' &&
          <div>
            <ModuleTitle title="人群详情" />
            <div className="push-tool-detail-container">
              <Table
                columns={columns}
                dataSource={userTagInfoDS}
                pagination={false}
                bordered
              />
            </div>,
          </div>
        }
        <ModuleTitle title="配置详情" />
        <div className="push-tool-detail-container">
          <Row>
            <Col {...colNameSpan}>推送活动名称</Col>
            <Col {...colValueSpan}>{data.activityName}</Col>
          </Row>
          {data.groupInfo && 
          <Row>
            <Col {...colNameSpan}>运营活动ID</Col>
            <Col {...colValueSpan}>{data.groupInfo.groupId}</Col>
          </Row>}
          {data.groupInfo && 
          <Row>
            <Col {...colNameSpan}>运营活动名称</Col>
            <Col {...colValueSpan}>{data.groupInfo.groupName}</Col>
          </Row>}
          <Row>
            <Col {...colNameSpan}>业务线</Col>
            <Col {...colValueSpan}>{data.bizLineName}</Col>
          </Row>
          <Row>
            <Col {...colNameSpan}>规则类型</Col>
            <Col {...colValueSpan}>{data.pushRule && PUSH_TOOL_RULE_DETAIL_MAP[data.pushRule].name}</Col>
          </Row>

          {storeDetails.length > 0 &&
            <Row>
              <Col {...colNameSpan}>油站列表</Col>
              <Col {...colValueSpan}>
                <Table
                  style={{ textAlign: 'center' }}
                  size="small"
                  columns={oilColumns}
                  dataSource={detail.data && detail.data.storeDetails}
                  pagination={{ pageSize: 5 }}
                />
              </Col>
            </Row>
          }
          {(data.pushRule && data.pushRule === '2') &&
            <Row>
              <Col {...colNameSpan}>投放人群</Col>
              <Col {...colValueSpan}>
                <div>
                  <span>投放角色： </span>
                  <span>{PUSH_TOOL_ROLE_MAP[data.pushRole] && PUSH_TOOL_ROLE_MAP[data.pushRole].name}</span>
                </div>
                <br />
                <div>
                  <span>常驻地规则：</span>
                  <span>{PUSH_TOOL_LOCATION_RULE_MAP[data.locationRule]}</span>
                </div>
              </Col>
            </Row>}
          {(data.pushRule && data.pushRule === '3') &&
            <Row>
              <Col {...colNameSpan}>圈选半径</Col>
              <Col {...colValueSpan}>{data.locationRule}公里</Col>
            </Row>
          }
          <Row>
            <Col {...colNameSpan}>推送通道及文案</Col>
            <Col span={20}>
              {taskList.map((cur, index) => (
                <div key={index}>
                  <Row>
                    <Col span={15}>
                      <PushCard
                        pushItem={cur}
                        activityId={data.activityId}
                        bizLineId={data.bizLineId}
                        pushRule={`${data.pushRule}`}
                        match={this.props.match}
                      />
                    </Col>
                    {cur.pushChannelId === '8' &&
                      <Col span={5}>
                        <MobileDisplay text={cur} mobileTitle={mobileTitle} />
                      </Col>
                    }
                  </Row>

                </div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col {...colNameSpan}>创建人</Col>
            <Col {...colValueSpan}>{data.operatorName}</Col>
          </Row>
          <Row>
            <Col {...colNameSpan}>创建时间</Col>
            <Col {...colValueSpan}>{data.createTime}</Col>
          </Row>
          <Row>
            <Col {...colNameSpan}>操作记录</Col>
            <Col {...colValueSpan}>
              {recordList.length > 1
                ? <div>
                  {this.state.moreRecords
                    ? <div>
                      {recordList.map((record, index) =>
                        (<div key={index}>{record.operateRecord} {record.operatorName} {record.operateTime}</div>))}
                      <div>
                        <a onClick={(e) => {
                          e.preventDefault()
                          this.setState({ moreRecords: false })
                        }}
                        >收起</a>
                      </div>

                    </div>
                    : <div>
                      {recordList.map((record, index) =>
                        (<div key={index}>{record.operateRecord} {record.operatorName} {record.operateTime}</div>))[0]}
                      <div>
                        <a onClick={(e) => {
                          e.preventDefault()
                          this.setState({ moreRecords: true })
                        }}
                        >加载更多</a>
                      </div>

                    </div>
                  }
                </div>
                : <div>{recordList.map((record, index) =>
                  (<div key={index}>{record.operateRecord} {record.operatorName} {record.operateTime}</div>))[0]}</div>
              }
            </Col>
          </Row>
        </div>
        {/* </Module> */}
        <SelectDocModal />
        {userTagPackgeDS.length > 0 && 
          [
            <ModuleTitle title="投放策略" />,
            <div className="push-tool-detail-container">
              <Table
                columns={columns}
                dataSource={userTagPackgeDS}
                pagination={false}
                bordered
              />
            </div>,
          ]
        }

      </div>
    )
  }
}
export default connect(state => ({
  detail: state.pushCenter.detail,
  userTagInfo: state.pushCenter.userTagInfo,
  userTagPackge: state.pushCenter.userTagPackge,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushDetail))
