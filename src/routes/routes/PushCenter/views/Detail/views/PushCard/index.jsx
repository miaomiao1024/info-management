import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import cookie from 'js-cookie'
import {
  Form,
  Row,
  Col,
  message,
  Popconfirm,
  Img,
} from 'antd'
import { actions, services as API } from '@modules/PushCenter'
import { Link } from 'react-router-dom'
import { 
  auth, 
  sso,
  fetch  
} from '@didi/fate-common'
import EditCard from './EditCard'
import DescCard from './DescCard'
// import Audit from '../../PushCenter/PushList/Audit'
import Audit from '../../../Index/views/PushList/Audit'
const { toLogin } = sso

let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

class PushCard extends Component {
    static propTypes = {
      pushItem: T.object.isRequired,
      form: T.object.isRequired,
      bizLineId: T.string.isRequired,
      activityId: T.string.isRequired,
      actions: T.object.isRequired,
      match: T.object.isRequired,
      menus: T.array.isRequired,
      templateTag: T.array.isRequired,
      pushRule: T.string.isRequired,
    }
    constructor(props) {
      super(props)
      this.state = {
        editStatus: false,    // 默认为非编辑状态
        tagName: '',
        tagId: '',
      }
    }
    // componentWillReceiveProps(nextProps) {
    //   this.getTagInfo(nextProps)
    // }
    componentDidMount() {
      this.getTagInfo()
    }
    getTagInfo = async () => {
      const {
        pushRule,
        pushItem,
      } = this.props
      if (pushRule === '4') {
        const userTagId = pushItem.userTagId
        if (userTagId) {
          const data = await API.fetchUserTag({userTagId})
          if (data && data.items && data.items[0]) {
            this.setState({tagName: data.items[0].tagName, tagId: data.items[0].tagId })
          }
        }

      }
    }
    onClickAudit = (e, info) => {
      e.preventDefault()
      const { actions: { setAuditModal, setAuditParams } } = this.props
      setAuditModal(true)
      setAuditParams({ activityId: this.props.activityId, bizLineId: this.props.bizLineId, info })
    }
      clickSave = () => {
        const { getFieldValue } = this.props.form
        const pushItem = this.props.pushItem
        let pushText = getFieldValue('pushText')
        const pushChannel = pushItem.pushChannelId
        const taskId = pushItem.taskId
        const status = pushItem.statusId
        const activityId = this.props.activityId
        const bizLine = this.props.bizLineId
        const { templateTag } = this.props
        let pushTextTemp = pushText
        if (pushChannel !== 6) {
          templateTag.forEach(({ labelName, fieldName }) => {
            if (pushTextTemp.indexOf(`{${labelName}}`) !== -1) {
              const reg = new RegExp(`{${labelName}}`, 'ig')
              pushTextTemp = pushTextTemp.replace(reg, fieldName)
            }
          })
        }
        pushText = pushTextTemp
        if (!pushText) {
          message.error('文案不能为空')
          return
        }
        let landingPage
        if (this.props.pushRule !== 2) {
          landingPage = getFieldValue('landingPage')
          if (pushItem.pushChannelId !== '4' && !landingPage) {
            message.error('落地页不能为空')
            return
          }
        }
        let originalLandingPage
        originalLandingPage = getFieldValue('originalLandingPage')
    
        const values = {
          activityId,
          bizLine,
          taskId,
          pushChannel,
          status,
          pushText,
          landingPage,
          originalLandingPage,
        }
        fetch('/api/push/task/update', {
          method: 'POST',
          data: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res && res.status === 10000) {
            message.success('操作成功')
            const {
              id,
            } = this.props.match.params
            const { fetchPushToolDetail } = this.props.actions
            fetchPushToolDetail({ activityId: id })
            // location.reload()
          } else if (res && res.status !== 10000) {
            message.success(res.msg)
          }
        })
        this.setState({ editStatus: false })
      }
      clickEdit = () => {
        this.setState({ editStatus: true })
      }
      // 编辑/保存外的操作
      clickOthers = (val) => {
        const taskId = this.props.pushItem.taskId
        const pushChannel = this.props.pushItem.pushChannelId
        const status = this.props.pushItem.statusId
        const activityId = this.props.activityId
        const bizLine = this.props.bizLineId
        const values = {
          activityId,
          bizLine,
          taskId,
          pushChannel,
          status,
        }
        fetch(`/api/push/task/${val}`, {
          method: 'post',
          data: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          if (res && res.status === 10000) {
            message.success('操作成功')
            const {
              id,
            } = this.props.match.params
            const { fetchPushToolDetail } = this.props.actions
            fetchPushToolDetail({ activityId: id })
          } else if (res && res.status !== 10000) {
            message.success(res.msg)
          }
        })
      }
      cancelSave = () => {
        this.setState({ editStatus: false })
      }
      render() {
        const menus = this.props.menus
        const { editStatus, tagName, tagId } = this.state
        const cur = this.props.pushItem
        const colNameSpan = {
          span: 5,
        }
        const colValueSpan = {
          span: 15,
        }
        const fatigueEndTime = new Date(parseInt(cur.fatigueEndTime))
        const fatigueEndTimeStr = fatigueEndTime.toLocaleString('chinese', { hour12: false })
        const fatigueStartTime = new Date(parseInt(cur.fatigueStartTime))
        const fatigueStartTimeStr = fatigueStartTime.toLocaleString('chinese', { hour12: false })
        const endTime = new Date(parseInt(cur.endTime))
        const endTimeStr = endTime.toLocaleString('chinese', { hour12: false })
        const startTime = new Date(parseInt(cur.startTime))
        const startTimeStr = startTime.toLocaleString('chinese', { hour12: false })
        return (
          <div className="push-card-page">
            <Row style={{ marginBottom: '0.3em' }}>
              <Col span={12}>{
                cur.pushChannelName
              }</Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                {(auth(menus, '/api/push/activity/submit')
                && !cur.couponIds
                && (cur.statusId === '1' || cur.statusId === '6' || cur.statusId === '7')
                )
                && <span>
                  {editStatus
                    ? <Popconfirm
                      title="确定保存编辑内容？"
                      onConfirm={this.clickSave}
                      onCancel={this.cancelSave}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a>保存</a>
                    </Popconfirm>
                    : <a
                      onClick={() => {
                        this.clickEdit()
                      }}
                    >编辑</a>
                  }
                </span>}
                {(auth(menus, '/api/push/task/audit') && cur.statusId === '6')
                &&
                    <a
                      onClick={(e) => { this.onClickAudit(e, cur) }}
                    >审核</a>
                }
                <Audit source="detail" activityId={this.props.match.params.id} />
                {(auth(menus, '/api/push/task/online') && cur.statusId === '1')
                &&
                <Popconfirm
                  title="确定进行该操作？"
                  onConfirm={() => { this.clickOthers('online') }}
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
                  onConfirm={() => { this.clickOthers('delete') }}
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
                  onConfirm={() => { this.clickOthers('offline') }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a>下线</a>
                </Popconfirm>
                }
              </Col>
            </Row>
            <div style={{ background: '#fafafa', padding: '1em' }}>
              {cur.pushChannelId === "8" && 
                <Row>
                  <Col {...colNameSpan}>消息标题</Col>
                  <Col {...colValueSpan}>{cur.imConfig.imTitle}</Col>
                </Row>
              }
              <Row>
                <Col {...colNameSpan}>类型</Col>
                <Col {...colValueSpan}>{cur.pushType}</Col>
              </Row>
              {cur.pushChannelId === "8" && 
                <Row>
                  <Col {...colNameSpan}>消息类型</Col>
                  <Col {...colValueSpan}>{cur.imConfig.typeId === 1? "文本" : "图文"}</Col>
                </Row>
              }
              {cur.pushChannelId === "8" && cur.imConfig.typeId === 2 && 
                <Row>
                  <Col {...colNameSpan}>消息图片</Col>
                  <Col {...colValueSpan}>
                    <img
                      alt="logo"
                      style={{ width:'56%' }}
                      src={cur.imConfig.imageUrl}
                    />
                  </Col>
                </Row>
              }
              {
                cur.gapTime && cur.periodTimes
                  ? <div>
                    <Row>
                      <Col {...colNameSpan}>每日推送时间段</Col>
                      <Col {...colValueSpan}>{cur.periodTimes.join(', ')}</Col>
                    </Row>
                    <Row>
                      <Col {...colNameSpan}>每日推送时间间隔</Col>
                      <Col {...colValueSpan}>{cur.gapTime}</Col>
                    </Row>
                  </div>
                  : <Row>
                    <Col {...colNameSpan}>PUSH时间</Col>
                    <Col {...colValueSpan}>{cur.timeText}</Col>
                  </Row>
              }
              
              {!cur.couponIds
            && <div>
              {editStatus
                ? <EditCard
                  pushText={cur.pushChannelId === "8"?cur.imConfig.imContent : cur.pushText}
                  pushChannelId={cur.pushChannelId}
                  landingPage={cur.pushChannelId === "8"? cur.imConfig.action : cur.landingPage}
                  originalLandingPage = {cur.pushChannelId === "8"? cur.imConfig.action : cur.originalLandingPage}
                  pushRule={this.props.pushRule}
                  form={this.props.form}
                />
                : <DescCard
                  pushText={cur.pushChannelId === "8"?cur.imConfig.imContent : cur.pushText}
                  pushChannelId={cur.pushChannelId}
                  landingPage={cur.pushChannelId === "8"? cur.imConfig.action : cur.landingPage}
                  originalLandingPage = {cur.pushChannelId === "8"? cur.imConfig.action : cur.originalLandingPage}
                />
              }
            </div>
              }
              {cur.startTime && cur.endTime &&
            <Row>
              <Col {...colNameSpan}>推送有效期</Col>
              <Col>{startTimeStr} ~ {endTimeStr}</Col>
            </Row>
              }
              <Row>
                <Col {...colNameSpan}>状态</Col>
                <Col {...colValueSpan}>{cur.statusName}</Col>
              </Row>
              {user && user.roleList.indexOf('push_fatigue') !== -1
            && <div>
              <Row>
                <Col {...colNameSpan}>忽略疲劳度控制</Col>
                <Col {...colValueSpan}>{cur.ignoreGlobalFatigue === '1' ? '是' : '否'}</Col>
              </Row>
              {cur.fatigueStartTime && cur.fatigueEndTime
              && <Row>
                <Col {...colNameSpan}>忽略疲劳度控制时间</Col>
                <Col {...colValueSpan}>{fatigueStartTimeStr} ~ {fatigueEndTimeStr}</Col>
              </Row>
              }
            </div>
              }
              {cur.couponIds
            && <Row>
              <Col {...colNameSpan}>优惠券ID</Col>
              <Col {...colValueSpan}>{cur.couponIds.map(couponId => (<div>{couponId}</div>))}</Col>
            </Row>
              }
              {
                this.props.pushRule === '4' &&
                <Row>
                  <Col {...colNameSpan}>人群包</Col>
                  <Col {...colValueSpan}>
                    {/* <a href={`/customer/tag/detail/${tagId}`}>
                      <span>{tagName}</span>
                    </a> */}
                    <Link to={`/customer/tag/detail/${tagId}`} target="_blank">
                      <span>{tagName}</span>
                    </Link>
                  </Col>
                </Row>
              }
            </div>
          </div>
        )
      }
}

export default connect(state => ({
  detail: state.pushCenter.detail,
  menus: state.common.features.data,
  templateTag: state.pushCenter.templateTag,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushCard))
  
  