import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Link,
} from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Form,
  message,
  Tooltip,
} from 'antd'
import Audit from './Audit'
import './index.styl'
import { actions } from '@modules/PushCenter'
//import { actions } from '@modules/Experiment'
import SelectList from './SelectList'
import { auth, fetch } from '@didi/fate-common'
import {
  PUSH_TOOL_RULE_MAP,
  PUSH_TOOL_ROLE_MAP,
  PUSH_TOOL_LOCATION_RULE_MAP,
} from '../../../../configs'


class List extends Component {
  static propTypes = {
    item: T.object.isRequired,
    actions: T.object.isRequired,
    seartchParams: T.object.isRequired,
    menus: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      // auditActivityId: '',
      // auditBizLine: '',
      // auditInfo: '',
    }
  }
  onClickAudit = (e, item, info) => {
    e.preventDefault()
    // this.setState({ auditActivityId: item.activityId, auditBizLine: item.bizLineId, auditInfo: info }, () => {

    // })
    const { actions: { setAuditModal, setAuditParams } } = this.props
    setAuditModal(true)
    setAuditParams({ activityId: item.activityId, bizLineId: item.bizLineId, info })
  }
  clickOthers = (val, info, activityId, bizLineId) => {
    const values = {
      activityId,
      bizLine: bizLineId,
      taskId: info.taskId,
      pushChannel: info.pushChannelId,
      status: info.statusId,
    }
    fetch(`/api/push/task/${val}`, {
      method: 'POST',
      data: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        message.success('操作成功')
        const { fetchPushToolActivityList } = this.props.actions
        fetchPushToolActivityList(this.props.seartchParams)
      } else if (res && res.status !== 10000) {
        message.error(res.msg)
      }
    })
  }
  handleSelectPush = (item,index) => {
    if(item.taskList[0].statusName != "生效中" && item.taskList[0].statusName != "待生效"){
      message.warn('仅支持状态为“生效中”“待生效”的push活动')
      return
    }
    if(item.taskList[0].pushChannelName == "优惠券"){
      message.warn('不能选择推送通道为"优惠劵"的push活动')
      return
    }
    const { experimentActions : { checkedSelectedPush , setModalState} } = this.props
    item.checkedIndex = index 
    checkedSelectedPush(item)
    setModalState(false)
    const {activityStrategys} = this.props
    const experimentParams = {
      experimentParams:item
    }
    activityStrategys[index] = Object.assign({}, activityStrategys[index], experimentParams)
    const {experimentActions:{addActivityStrategy}} =this.props
    addActivityStrategy(activityStrategys)
  }
  render() {
    const { item, menus,experimentModal} = this.props
    return (
      <div
        className="push-tool-list"
        style={{ border: '1px solid #ccc', padding: '1em', marginBottom: '2em', borderRadius: '4px' }}
      >
        <Row style={{ borderBottom: '1px dashed #ccc', paddingBottom: '1em' }}>
          <Col span={20}>
            <span style={{ marginRight: '1em' }}>活动ID：{item.activityId}</span>
            <span style={{ marginRight: '1em' }}>活动名称：{item.activityName}</span>
            <span style={{ marginRight: '1em' }}>业务线：{item.bizLineName}</span>
            <span style={{ marginRight: '1em' }}>操作人：{item.operatorName}</span>
            <span>时间：{item.createTime}</span>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Link to={`/customer/push/detail/${item.activityId}`}>
              <Button style={{ marginRight: '1em' }} type="primary">详情</Button>
            </Link>
            {experimentModal &&
              <SelectList item={item} />
            }
            {/* <Button type="primary" disabled>查看数据</Button> */}
          </Col>
          <Col span={20}>
            {item.pushRule &&
            <span style={{ marginRight: '1em' }}>规则类型：
              { PUSH_TOOL_RULE_MAP[item.pushRule] && PUSH_TOOL_RULE_MAP[item.pushRule].name}
            </span>}
            {item.pushRole && item.pushRule === '2' &&
            <span style={{ marginRight: '1em' }}>投放角色：
              {PUSH_TOOL_ROLE_MAP[item.pushRole] && PUSH_TOOL_ROLE_MAP[item.pushRole].name}
            </span>}
            {item.locationRule && item.pushRule === '2' &&
            <span style={{ marginRight: '1em' }}>常驻地规则：
              {PUSH_TOOL_LOCATION_RULE_MAP[item.locationRule]}
            </span>}
            {item.locationRule && item.pushRule === '3' &&
            <span style={{ marginRight: '1em' }}>圈选半径：
              {item.locationRule}公里
            </span>}
            {item.groupInfo &&
            <span style={{ marginRight: '1em' }}>运营活动ID：
              {item.groupInfo.groupId}
            </span>}
            {item.groupInfo &&
            <span style={{ marginRight: '1em' }}>运营活动名称：
              {item.groupInfo.groupName}
            </span>}
          </Col>
        </Row>
        <table style={{ width: '100%', textAlign: 'center', lineHeight: '3em', marginTop: '2em' }} cellSpacing="0">
          <thead>
            <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
              <td style={{ width: '15%' }}>任务ID</td>
              <td style={{ width: '10%' }}>推送通道</td>
              <td style={{ width: '15%' }}>文案/优惠券ID</td>
              <td style={{ width: '15%' }}>落地页</td>
              <td style={{ width: '10%' }}>推送类型</td>
              <td style={{ width: '15%' }}>推送时间</td>
              <td style={{ width: '10%' }}>状态</td>
              <td style={{ width: '10%' }}>操作</td>
            </tr>
          </thead>
          <tbody>
            {item.taskList.map((cur, index) => (
              <tr key={index}>
                <td>{cur.taskId || ''}</td>
                <td>{cur.pushChannelName || ''}</td>
                <td>
                  <Tooltip
                    title={<div style={{ }}>{cur.pushText}</div>}
                    placement="top"
                  ><span
                      style={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-all' }}
                    >{cur.pushText || ''}</span></Tooltip>
                </td>
                <td>
                  <a
                    href={cur.landingPage}
                    target="_blank"
                    style={{ textDecoration: 'underline', color: 'black', wordBreak: 'break-all' }}
                  >{cur.landingPage || ''}
                  </a>
                </td>
                <td>{cur.pushType || ''}</td>
                <td>{cur.timeText || ''}</td>
                <td>{cur.statusName || ''}</td>
                <td>
                  {(auth(menus, '/api/push/task/audit') && cur.statusId === '6')
                    && <div style={{ display: 'inline-block', marginRight: '4px' }}><a
                      onClick={(e) => { this.onClickAudit(e, item, cur) }}
                    >审核</a>
                    <Audit /></div>
                  }
                  {(auth(menus, '/api/push/task/online') && cur.statusId === '1')
                    &&
                    <Popconfirm
                      title="确定进行该操作？"
                      onConfirm={() => {
                        this.clickOthers('online', cur, item.activityId, item.bizLineId)
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>上线</a>
                    </Popconfirm>
                  }
                  {(auth(menus, '/api/push/task/delete')
                && (cur.statusId === '9' || cur.statusId === '8' || cur.statusId === '6'))
                    &&
                    <Popconfirm
                      title="确定进行该操作？"
                      onConfirm={() => { this.clickOthers('delete', cur, item.activityId, item.bizLineId) }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>删除</a>
                    </Popconfirm>
                  }
                  {(auth(menus, '/api/push/task/offline') && cur.statusId === '2')
                    &&
                    <Popconfirm
                      title="确定进行该操作？"
                      onConfirm={() => { this.clickOthers('offline', cur, item.activityId, item.bizLineId) }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>下线</a>
                    </Popconfirm>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
export default connect(state => ({
  isShowAuditModal: state.pushCenter.isShowAuditModal,
  seartchParams: state.pushCenter.seartchParams,
  menus: state.common.features.data,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(List))

