import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Modal,
  Icon,
  Tooltip,
  message,
  Upload,
  Radio,
  Table,
  InputNumber,
} from 'antd'
import T from 'prop-types'
import cookie from 'js-cookie'
import { 
  fetch,
  sso,
  datef,
} from '@didi/fate-common'
import PushText from './PushText'
import { actions } from '@modules/PushCenter'
import {
  PUSH_TOOL_BUSINESSES,
  PUSH_CHANNEL_PUSH_DRIVER,
  PUSH_CHANNEL_PUSH_PASSENGER,
  PUSH_CHANNEL_BROADCAST,
  PUSH_CHANNEL_MESSAGE,
  PUSH_CHANNEL_COUPON,
  PUSH_CHANNEL_PUSH_XIAOJU,
  PUSH_TOOL_ROLE,
  PUSH_TOOL_LOCATION_RULE,
  PUSH_TOOL_ROLE_OIL_SPECIAL_QUICK,
  PUSH_CHANNEL_MAP,
} from '../../../../configs'
import './index.styl'

const { toLogin } = sso
const { formatDate } = datef
let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}


class FormPage extends Component {
  static propTypes = {
    form: T.object.isRequired,
    selectedTag: T.array.isRequired,
    taskListParams: T.array.isRequired,
    history: T.object.isRequired,
    actions: T.object.isRequired,
    templateTag: T.array.isRequired,
    activatedTab: T.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      showPushNameTipModal: false,
      giftUrl: '',
      uploadFileName: '',
      storeDetails: [],
      loading: false,
    }
    this.state = {
      fileList: [],
      uploadFiles: [],
    }
  }
  // componentDidMount() {
  //   const { actions: { fetchPushToolTemplateTag } } = this.props
  //   fetchPushToolTemplateTag()
  // }
  // componentWillReceiveProps(nextProps) {
  //   const { activatedTab } = nextProps
  // }
  onSubmit = (e) => {
    e.preventDefault()
    const { form, activatedTab } = this.props
    const { getFieldValue } = form
    const { giftUrl, uploadFileName } = this.state
    const values = {
      activityName: '',
      bizLine: '',
      userTagId: '',
      taskList: [],
    }
    const taskListParams = this.props.taskListParams
    // 只有普通逻辑会选择人群包
    // values.pushRule = getFieldValue('pushRule')
    values.pushRule = activatedTab
    if (values.pushRule === '1') {
      if (!this.props.selectedTag[0]) {
        message.error('请选择人群包')
        return
      }
      values.userTagId = this.props.selectedTag[0].tagId
    } else {
      delete values.userTagId
    }

    if (!getFieldValue('activityName')) {
      message.error('请输入活动名称')
      return
    }
    if (getFieldValue('activityName').length > 20) {
      message.error('活动名称长度不超过20')
      return
    }
    values.activityName = getFieldValue('activityName')
    if (!getFieldValue('bizLine')) {
      message.error('请选择业务线')
      return
    }
    values.bizLine = getFieldValue('bizLine')
    // if (!getFieldValue('pushRule')) {
    //   message.error('请选择活动类型')
    //   return
    // }
    // LBS
    if (values.pushRule === '3') {
      if (!uploadFileName) {
        message.error('请选上传油站文件')
        return
      }
      const fileName = uploadFileName
      if (!giftUrl) {
        message.error('请选上传油站文件')
        return
      }
      const fileGiftUrl = giftUrl
      if (!getFieldValue('locationRule')) {
        message.error('请填写圈选半径')
        return
      }
      const locationRule = getFieldValue('locationRule')

      values.lbsPush = {
        fileName, fileGiftUrl, locationRule,
      }
      delete values.userTagId
    } else {
      delete values.lbsPush
    }
    // 油站导流逻辑
    if (values.pushRule === '2') {
      if (uploadFileName === '') {
        message.error('请选上传油站文件')
        return
      }
      const fileName = uploadFileName
      if (giftUrl === '') {
        message.error('请选上传油站文件')
        return
      }
      const fileGiftUrl = giftUrl
      if (!getFieldValue('pushRole')) {
        message.error('请选投放角色')
        return
      }
      const pushRole = getFieldValue('pushRole')
      if (!getFieldValue('locationRule')) {
        message.error('请选择常驻地规则')
        return
      }
      const locationRule = getFieldValue('locationRule')
      values.storeTransformUser = {
        fileName, fileGiftUrl, pushRole, locationRule,
      }
      delete values.userTagId
    } else {
      delete values.storeTransformUser
    }
    if (getFieldValue('driverPush') && getFieldValue('driverPush').status) {
      if (!this.validate(taskListParams[getFieldValue('driverPush').pushChannel], '司机端PUSH')) {
        return
      }
      this.addTaskList(values.taskList, taskListParams[getFieldValue('driverPush').pushChannel])
      // values.taskList.push(getFieldValue('driverPush'))
    }

    if (getFieldValue('passengerPush') && getFieldValue('passengerPush').status) {
      if (!this.validate(taskListParams[getFieldValue('passengerPush').pushChannel], '乘客端PUSH')) {
        return
      }
      // values.taskList.push(getFieldValue('passengerPush'))
      this.addTaskList(values.taskList, taskListParams[getFieldValue('passengerPush').pushChannel])
    }
    if (getFieldValue('driverBroadcast') && getFieldValue('driverBroadcast').status) {
      if (!this.validate(taskListParams[getFieldValue('driverBroadcast').pushChannel], '司机端播报')) {
        return
      }
      // values.taskList.push(getFieldValue('driverBroadcast'))
      this.addTaskList(values.taskList, taskListParams[getFieldValue('driverBroadcast').pushChannel])
    }
    if (getFieldValue('xiaojuPush') && getFieldValue('xiaojuPush').status) {
      if (!this.validate(taskListParams[getFieldValue('xiaojuPush').pushChannel], '小桔车服端PUSH')) {
        return
      }
      // values.taskList.push(getFieldValue('xiaojuPush'))
      this.addTaskList(values.taskList, taskListParams[getFieldValue('xiaojuPush').pushChannel])
    }
    if (getFieldValue('message') && getFieldValue('message').status) {
      if (!this.validate(taskListParams[getFieldValue('message').pushChannel], '短信')) {
        return
      }
      // values.taskList.push(getFieldValue('xiaojuPush'))
      this.addTaskList(values.taskList, taskListParams[getFieldValue('message').pushChannel])
    }
    if (getFieldValue('coupon') && getFieldValue('coupon').status) {
      if (!this.validate(taskListParams[getFieldValue('coupon').pushChannel], '优惠券')) {
        return
      }
      // values.taskList.push(getFieldValue('xiaojuPush'))
      this.addTaskList(values.taskList, taskListParams[getFieldValue('coupon').pushChannel])
    }
    if (values.taskList.length === 0) {
      message.error('请选择至少一个推送通道')
      return
    }
    fetch('/api/push/activity/submit', {
      method: 'POST',
      data: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        const { history } = this.props
        history.push('/customer/push')
      } else if (res && res.status !== 10000) {
        message.error(res.msg)
      }
    })
  }
  validate = function (pushChannel, str) {
    const { activatedTab } = this.props
    // const pushRule = getFieldValue('pushRule')
    const pushRule = activatedTab
    if (pushChannel.pushType === '2') {
      if (pushChannel.pushTimes.length === 0 || !pushChannel.pushTimes[0]) {
        message.error(`请选择${str}时间`)
        return false
      }
      const currentTime = Date.parse(new Date())
      if (pushChannel.pushTimes[0] < currentTime) {
        message.error(`${str}时间不能小于当前时间`)
        return false
      }
    }
    if (pushChannel.pushType === '3') {
      if (pushChannel.startTime === '') {
        message.error(`请选择${str}推送有效期`)
        return false
      }
      const now = Date.parse(new Date())
      if (pushChannel.startTime < now) {
        message.error(`${str}推送有效期不能低于当前时间`)
        return false
      }

      if (pushChannel.dayType !== 0 && !pushChannel.dayType) {
        message.error(`${str}每隔几天必填`)
        return false
      }
      if (pushChannel.dayType === 6 && pushChannel.dayWeek.length === 0) {
        message.error(`请选择${str}每周哪天推送`)
        return false
      }
      if (pushChannel.dayType === 6 && pushChannel.dayWeek.length > 2) {
        message.error(`${str}每周最多选两天`)
        return false
      }
      if (pushRule === '3') {
        if (pushChannel.dayType !== 0 && pushChannel.pushPoint === '') {
          message.error(`请选择${str}周期PUSH时间点`)
          return false
        }
      } else {
        if (pushChannel.pushPoint === '') {
          message.error(`请选择${str}周期PUSH时间点`)
          return false
        }
      }
      // if ((pushChannel.dayType !== 0 && pushRule === '2')  && pushChannel.pushPoint === '') {
      //   message.error(`请选择${str}周期PUSH时间点`)
      //   return false
      // }
      // pushChannel.pushPoint = pushChannel.pushPoint
      if (user && user.roleList.indexOf('push_fatigue') !== -1
      && pushChannel.ignoreGlobalFatigue === '1' && pushChannel.fatigueStartTime === '') {
        message.error(`请选择${str}全局疲劳度控制时间`)
        return false
      }
      if (pushChannel.fatigueStartTime && pushChannel.fatigueEndTime) {
        if (pushChannel.fatigueStartTime < pushChannel.startTime 
      || pushChannel.fatigueEndTime > pushChannel.endTime) {
          message.error(`${str}全局疲劳度控制时间必须在推送有效期`)
          return false
        }
      }
    }
    if (pushRule === '3' && pushChannel.pushType ==='3' && pushChannel.dayType === 0) {
      let flag = true
      pushChannel.hourRanges.forEach(element => {
        if ((element.startHour && !element.endHour) || (!element.startHour && element.endHour)) {
          message.error(`${str}每日推送时间请填写完整`)
          flag = false
        }
      })
      if (!flag) {
        return false
      }
      let startHours = []
      let endHours = []
      pushChannel.hourRanges.forEach(item => {
        if (item.startHour) {
          startHours.push(item.startHour.toDate().getHours())
        }
      })
      pushChannel.hourRanges.forEach(item => {
        if (item.endHour) {
          const endHour = item.endHour.toDate().getHours() === 0 ? 24 : item.endHour.toDate().getHours()
          endHours.push(endHour)
        }
      })
      startHours = startHours.sort((a,b)=> a>=b ? 1 : -1)
      endHours = endHours.sort((a,b)=> a>=b ? 1 : -1)
      for(let i = 1; i < startHours.length; i++) {
        if (startHours[i] <= endHours[i-1]) {
          message.error(`${str}每日推送时间有重叠`)
          return false
        }
      }
      if (!pushChannel.gapTime) {
        message.error(`${str}每日推送时间间隔`)
        return false
      }
    }
    if (pushChannel.pushChannel === 5) {
      if (pushChannel.couponIds.length === 0) {
        message.error(`请选择${str}`)
        return false
      }
    } else {
      if (pushChannel.pushText === '') {
        message.error(`请填写${str}文案`)
        return false
      }
      if (pushRule !== '2') {
        if (pushChannel.pushChannel !== 4 && pushChannel.landingPage === '') {
          message.error(`请填写${str}落地页`)
          return false
        }
      }
    }
    return true
  }
  addTaskList = (taskList, item) => {
    const { templateTag, activatedTab } = this.props
    // const pushRule = getFieldValue('pushRule')
    const pushRule = activatedTab

    const obj = { pushType: item.pushType, pushChannel: item.pushChannel }
    // if (item.pushChannel !== 6) {

    // }
    let pushText = item.pushText
    templateTag.forEach(({ labelName, fieldName }) => {
      if (pushText.indexOf(`{${labelName}}`) !== -1) {
        const reg = new RegExp(`{${labelName}}`, 'ig')
        pushText = pushText.replace(reg, fieldName)
      }
    })
    obj.pushText = pushText
    if (item.pushType === '2') {
      obj.pushTimes = item.pushTimes
    } else if (item.pushType === '3') {
      obj.startTime = item.startTime
      obj.endTime = item.endTime
      obj.dayType = item.dayType
      if (pushRule === '3' && item.dayType === 0) {
        let periodTimes = []
        item.hourRanges.forEach(element => {
          periodTimes.push(`${element.startHour.toDate().getHours()}-${element.endHour.toDate().getHours() === 0
            ? 24 : element.endHour.toDate().getHours()}`)
        })
        obj.periodTimes = periodTimes
        obj.gapTime = item.gapTime
      } else {
        obj.pushPoint = item.pushPoint
      }

      if (item.dayType === 6) {
        obj.dayWeek = item.dayWeek
      }
    }
    if (item.pushChannel === 5) {
      obj.couponIds = item.couponIds
    } else {
      // obj.pushText = item.pushText
      if (item.pushChannel !== 4) {
        obj.landingPage = item.landingPage
      }
      if (user && user.roleList.indexOf('push_fatigue') !== -1) {
        obj.ignoreGlobalFatigue = item.ignoreGlobalFatigue
        if (item.pushType === '3' && item.ignoreGlobalFatigue === '1') {
          obj.fatigueStartTime = item.fatigueStartTime
          obj.fatigueEndTime = item.fatigueEndTime
        }
      }
    }
    taskList.push(obj)
  }
  handleCancel = () => {
    this.setState({ showPushNameTipModal: false })
  }
  handleOk = () => {
    this.setState({ showPushNameTipModal: false })
  }
  deleteFile = () => {
    this.setState({ 
      giftUrl: '',
      uploadFileName: '',
      storeDetails: [],
    })
  }
  render() {
    const {
      form,
      // actions: { setPushRule },
      activatedTab,
    } = this.props
    const { getFieldValue } = form
    const {
      getFieldDecorator,
    } = form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    const subFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    const tableColumns = [{
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
    const bizLine = getFieldValue("bizLine")
    const uploadProps = {
      action: '/api/push/activity/upload',
      data: { bizLine },
      beforeUpload: (info) => {
        if (!bizLine) {
          message.error("请先选择业务线")
          return false
        }
      },
      onChange: (info) => {
        const file = info.file
        if (file.status === 'uploading' && this.state.loading === false) {
          this.setState({ loading: true })
        }
        if (file.status === 'done') {
          if (file.response && file.response.status === 10000) {
            message.success(`${file.name}上传成功`)
            const { giftUrl, invalids, storeDetails } = file.response.data
            this.setState({ giftUrl, uploadFileName: file.name, storeDetails })
            if (invalids.length > 0) {
              // message.error(invalids.join(','))
            }
          } else {
            message.error(file.response.msg)
          }
          this.setState({ loading: false })
        } else if (info.file.status === 'error') {
          message.error(`${file.name}上传失败`)
          this.setState({ loading: false })
        }
      },
    }
    return (
      <div >
        <div className="push-create-container">
          <Form onSubmit={this.onSubmit}>
            <Form.Item
              label="PUSH活动名称"
              {...formItemLayout}
              wrapperCol={{ span: 8 }}
              extra={
                <span
                  style={{
                    color: '#1890ff',
                    cursor: 'pointer',
                  }}
                  onClick={() => { this.setState({ showPushNameTipModal: true }) }}
                >命名规范</span>
              }
            >
              {getFieldDecorator('activityName', {
                rules: [{
                  required: true,
                  message: '必填',
                }, {
                  max: 20,
                  message: '不超过20个汉字',
                },
                {
                  pattern: /^([\u4e00-\u9fa5]|[A-Za-z])[\u4e00-\u9fa5\w\-()（）]*$/,
                  message: '必须以汉字或字母开头,只能包含数字、英文字母、汉字、下划线、中划线 、中英文括号',
                }],
              })(
                <Input placeholder="请输入后台用于识别推送活动的名称，不超过20个汉字" />,
              )}
            </Form.Item>
            <Form.Item
              label="业务线"
              {...formItemLayout}
              wrapperCol={{ span: 4 }}
            >
              {getFieldDecorator('bizLine', {
                rules: [{
                  required: true,
                  message: '必选',
                }],
              })(
                <Select placeholder="请选择业务线">
                  {PUSH_TOOL_BUSINESSES
                    && PUSH_TOOL_BUSINESSES.map(cur => (
                      <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>))}
                </Select>,
              )}
            </Form.Item>
            {
              (activatedTab === '2' || activatedTab === '3') &&
              <Form.Item
                label={activatedTab === '2'
                  ? <Tooltip title="请提前准备人群文件，并上传GIF，文件格式：am_alg_油站id_3km_location_gf_20190110.txt">
                  商户列表<Icon type="question-circle" theme="outlined" />
                  </Tooltip>
                  : '商户列表'
                }
                {...formItemLayout}
              >
                {!this.state.loading && this.state.uploadFileName 
                  ?
                  [
                    <div>
                      <span style={{ marginRight: '2em', fontSize: '12px' }}>{this.state.uploadFileName}</span>
                      <Icon
                        type="close-square"
                        style={{ color: 'rgb(24, 144, 255)' }}
                        onClick={this.deleteFile} 
                      />
                    </div>,
                    <Table
                      style={{ textAlign: 'center' }}
                      size="small"
                      columns={tableColumns}
                      dataSource={this.state.storeDetails}
                      pagination={{ pageSize: 5 }}
                    />]
                  :                <Upload
                    className="upload"
                    accept="text/csv,text/plain"
                    {...uploadProps}
                    defaultFileList={this.state.uploadFiles}
                    // beforeUpload={this.beforeUpload}
                    // fileList={this.state.uploadFilelist}
                    showUploadList={false}
                  >
                    <Button>
                      <Icon type="upload" /> 上传文件
                    </Button>
                    <span style={{ fontSize: '12px' }} onClick={e => e.stopPropagation()}>
                      请上传txt、csv文件</span>
                  </Upload>

                }

              </Form.Item>
            }
            {
              activatedTab === '2' &&
              <div className="ant-row ant-form-item">
                <div className="ant-col-4 ant-form-item-label">
                  <label htmlFor="pushRule" title="投放人群">投放人群</label>
                </div>
                <div className="ant-col-16 ant-form-item-control-wrapper">
                  <div className="ant-form-item-control has-success" >
                    <Form.Item
                      label="投放的角色"
                      {...subFormItemLayout}
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('pushRole', {
                        rules: [{
                          required: true,
                          message: '必选',
                        }],
                        initialValue: PUSH_TOOL_ROLE_OIL_SPECIAL_QUICK,
                      })(
                        <Radio.Group>
                          {
                            PUSH_TOOL_ROLE.map(cur => (
                              <Radio key={cur.id} value={cur.id}>{cur.name}</Radio>
                            ))
                          }
                        </Radio.Group>,
                      )}
                    </Form.Item>
                    <Form.Item
                      label="常驻地规则"
                      {...subFormItemLayout}
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('locationRule', {
                        rules: [{
                          required: true,
                          message: '必选',
                        }],
                      })(
                        <Radio.Group>
                          {
                            PUSH_TOOL_LOCATION_RULE.map(cur => (
                              <Radio key={cur.id} value={cur.id}>{cur.name}</Radio>
                            ))
                          }
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </div>
                </div>
              </div>
            }
            {
              activatedTab === '3' &&
              <Form.Item
                label="圈选半径"
                {...formItemLayout}
                wrapperCol={{ span: 12 }}
              >
                {
                  getFieldDecorator('locationRule', {
                    rules: [{
                      required: true,
                      message: '必选',
                    }],
                  })(
                    <div>
                      <InputNumber style={{ width: '30%', marginRight: '1em' }} />
                      <span style={{fontSize: '12px'}}>单位：公里</span>
                    </div>
                    
                  )
                }
              </Form.Item>
            }


            <Row>
              <Col span={4} className="ant-form-item-label ant-form-item">
                <label>
                  <Tooltip
                    title={<div style={{ width: '15em' }}>PUSH通道各自独立，选择多个push通道的，系统会在你设置的时间点对选中的人群标签进行多次投放</div>}
                  >
                  推送通道及文案
                    <Icon type="question-circle" theme="outlined" />
                  </Tooltip>
                </label>
              </Col>
              <Col span={16}>
                {(activatedTab === '1' || activatedTab === '3' || (activatedTab === '2'
                 && getFieldValue('pushRole') === '2')) &&
                  [<Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_DRIVER]}>
                    {getFieldDecorator('driverPush')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_DRIVER]} pushChannel={1} />,
                    )}
                  </Form.Item>,
                  // <Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]}>
                  //   {getFieldDecorator('driverBroadcast')(
                  //     <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]} pushChannel={3} />,
                  //   )}
                  // </Form.Item>,
                  ]
                }
                {(activatedTab === '1' || activatedTab === '3' || (activatedTab === '2'
                 && getFieldValue('pushRole') === '2')) &&
                  <Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]}>
                    {getFieldDecorator('driverBroadcast')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]} pushChannel={3} />,
                    )}
                  </Form.Item>
                }
                {(activatedTab === '1' || (activatedTab === '2'
                 && getFieldValue('pushRole') === '1')) &&
                 <Form.Item>
                   {getFieldDecorator('passengerPush')(
                     <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_PASSENGER]} pushChannel={2} />,
                   )}
                 </Form.Item>
                }
                {activatedTab !== '3' && 
              <Form.Item>
                {getFieldDecorator('xiaojuPush')(
                  <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_XIAOJU]} pushChannel={6} />,
                )}
              </Form.Item>
                }
                <Form.Item>
                  {getFieldDecorator('message')(
                    <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_MESSAGE]} pushChannel={4} />,
                  )}
                </Form.Item>
                {activatedTab === '1' &&
                <Form.Item>
                  {getFieldDecorator('coupon')(
                    <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_COUPON]} pushChannel={5} />,
                  )}
                </Form.Item>
                }

              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: '2em', padding: '0 3em' }}
                >提交</Button>
                <Button
                  style={{ padding: '0 3em' }}
                  onClick={() => {
                    const { history } = this.props
                    history.push('/customer/push')
                  }}
                >取消</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Modal
          visible={this.state.showPushNameTipModal}
          onCancel={this.handleCancel}
          footer={[
            <div style={{ textAlign: 'center' }}><Button onClick={this.handleOk}>我知道了</Button></div>,
          ]}
        >
          <h3 style={{ textAlign: 'center' }}>PUSH工具命名规范</h3>
          <h3 style={{ color: 'blue' }}>请按照区域-活动名称-时间进行命名</h3>
          <p>如：</p>
          <p>北京-首页弹窗资源位投放-6月</p>
        </Modal>
      </div>
    )
  }
}
export default connect(state => ({
  selectedTag: state.pushCenter.selectedTag,
  taskListParams: state.pushCenter.taskListParams,
  templateTag: state.pushCenter.templateTag,
  activatedTab: state.pushCenter.activatedTab,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(FormPage))

