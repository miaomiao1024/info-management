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
  Spin,
  InputNumber,
  Popconfirm,
  notification,
} from 'antd'
import T from 'prop-types'
import cookie from 'js-cookie'
import {
  fetch,
  sso,
  datef,
} from '@didi/fate-common'
import PushText from './PushText'
import SelectLabelModal from './SelectLabelModal'
import DeliveryStrategy from './DeliveryStrategy'
import { actions } from '@modules/PushCenter'
import SelectDocModal from '../SelectDocTag/SelectDocModal'
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
  PUSH_CHANNEL_MESSAGE_PASSENGER,
  PUSH_CHANNEL_PUSH_QUANYI,
} from '../../../../configs'
import './index.styl'
import {
  ModuleTitle,
} from '@components'

const { toLogin } = sso
const { formatDate } = datef
let user = cookie.get('fate.sso.cookie')
const confirm = Modal.confirm;
if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}


class PushChannel extends Component {
  static propTypes = {
    form: T.object.isRequired,
    selectedTag: T.array.isRequired,
    taskListParams: T.array.isRequired,
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
      GroupModalVisible: false,
      selectedGroup: [],
      CheckedItem: false,
      checkPackage: "",
      marketingCreate:0,
    }
    this.state = {
      fileList: [],
      uploadFiles: [],
    }
  }
  componentDidMount() {
    const { actions: { fetchPushToolTemplateTag } } = this.props
    fetchPushToolTemplateTag()
    const { marketingCreate } = this.props
    if(marketingCreate){
      this.props.onRef(this)
    }
  }
  
  //提交push
  onSubmit = () => {
    const { form, activatedTab ,marketingCreate} = this.props
    const { getFieldValue } = form
    const { giftUrl, uploadFileName } = this.state
    const values = {
      activityName: '',
      bizLine: '',
      userTagId: '',
      taskList: [],
      groupId: '',
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
    if (getFieldValue('passengerMessage') && getFieldValue('passengerMessage').status) {
      if (!this.validate(taskListParams[getFieldValue('passengerMessage').pushChannel], '乘客端消息号')) {
        return
      }
      this.addTaskList(values.taskList, taskListParams[getFieldValue('passengerMessage').pushChannel])
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
    if (getFieldValue('quanyi') && getFieldValue('quanyi').status) {
      if (!this.validate(taskListParams[getFieldValue('quanyi').pushChannel], '权益')) {
        return
      }
      this.addTaskList(values.taskList, taskListParams[getFieldValue('quanyi').pushChannel])
    }
    if (values.taskList.length === 0) {
      message.error('请选择至少一个推送通道')
      return
    }else{
      values.taskList.map((item) => {
        item.checkPackage = this.state.checkPackage
        return item
      })
    }
    if (this.state.selectedGroup && this.state.selectedGroup.length > 0) {
      values.groupId = `${this.state.selectedGroup[0].groupId}`
    }
    console.log("最终提交字段")
    console.log(values)
    fetch('/api/push/activity/submit', {
      method: 'POST',
      data: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        if(marketingCreate === 100){
          notification.info({
            message: '创建成功',
            bottom: 50,
            duration: 3,
          })
          const { actions : {createExperimentModal}} = this.props
          createExperimentModal(true)
        }else{
          const { history } = this.props
          history.push('/customer/push')
        }
      } else if (res && res.status !== 10000) {
        message.error(res.msg)
      }
    })
  }
  validate = function (pushChannel, str) {
    const { activatedTab } = this.props
    // const pushRule = getFieldValue('pushRule')
    const pushRule = activatedTab
    if (pushChannel.pushChannel === 8) {
      if (pushChannel.imConfig.imTitle === '') {
        message.error(`请输入${str}消息标题`)
        return false
      }
      if (pushChannel.imConfig.typeId === '2' && pushChannel.imConfig.imageUrl === '') {
        message.error(`请上传${str}图片`)
        return false
      }
      if (pushChannel.imConfig.imContent === '') {
        message.error(`请填写${str}push文案`)
        return false
      }
    }
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
    if (pushRule === '3' && pushChannel.pushType === '3' && pushChannel.dayType === 0) {
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
      startHours = startHours.sort((a, b) => a >= b ? 1 : -1)
      endHours = endHours.sort((a, b) => a >= b ? 1 : -1)
      for (let i = 1; i < startHours.length; i++) {
        if (startHours[i] <= endHours[i - 1]) {
          message.error(`${str}每日推送时间有重叠`)
          return false
        }
      }
      if (!pushChannel.gapTime) {
        message.error(`${str}每日推送时间间隔`)
        return false
      }
    }
    if (pushChannel.pushChannel === 5 || pushChannel.pushChannel === 9) {
      if (pushChannel.couponIds.length === 0) {
        message.error(`请选择${str}`)
        return false
      }
    } else if (pushChannel.pushChannel !== 8) {
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
      if (pushRule === '4') {
        if (!pushChannel.userTagId) {
          message.error(`请选择${str}人群包`)
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
    const obj = { pushType: item.pushType, pushChannel: item.pushChannel, imConfig: item.imConfig }
    let pushText = item.pushText
    templateTag.forEach(({ labelName, fieldName }) => {
      if (pushText.indexOf(`{${labelName}}`) !== -1) {
        const reg = new RegExp(`{${labelName}}`, 'ig')
        pushText = pushText.replace(reg, fieldName)
      }
    })
    obj.pushText = pushText
    let { imConfig: { imContent } } = item
    templateTag.forEach(({ labelName, fieldName }) => {
      if (imContent.indexOf(`{${labelName}}`) !== -1) {
        const reg = new RegExp(`{${labelName}}`, 'ig')
        imContent = imContent.replace(reg, fieldName)
      }
    })
    obj.imConfig.imContent = imContent
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
    if (item.pushChannel === 5 || item.pushChannel === 9) {
      obj.couponIds = item.couponIds
    } else {
      // obj.pushText = item.pushText
      if (item.pushChannel !== 4 && pushRule !== '2') {
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
    if(item.pushChannel !== 5){
      obj.originalLandingPage = item.originalLandingPage
    }
    if (pushRule === '4') {
      obj.userTagId = item.userTagId
    }
    obj.imConfig = item.imConfig
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
  selectedBizLine = (value) => {
    const selectedName = PUSH_TOOL_BUSINESSES.find((element) => {
      return element.id === value
    })
    const { actions: { selectedBizLineParams } } = this.props
    selectedBizLineParams(selectedName)
  }
  visibleGroupChange = (visible) => {
    this.setState({ 
      GroupModalVisible: visible ,
      CheckedItem: false,
    })
  }
  selectGroupChange = (selectedGroup) => {
    this.setState({ selectedGroup })
  }
  deleteGroup = () => { 
    const {actions:{saveEquityData},lockingState} = this.props
    //true时不允许删除
    if(lockingState){
      message.info("已选择对应权益，禁止删除")
    }else{
      this.setState({ 
        selectedGroup: [], 
        CheckedItem: true,
      })
      saveEquityData([])
    }
  }
  selectedTagId = (tagId) => {
    this.setState({checkPackage:tagId})
  }
  render() {
    const {
      form,
      activatedTab,
      marketingCreate,
      SeletedbizLine,
    } = this.props
    const { selectedGroup } = this.state
    const {
      getFieldDecorator,
      getFieldValue,
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
    const columns = [{
      title: '运营活动ID',
      dataIndex: 'groupId',
      render: (text, record) => (record.groupId && record.groupId) || '--',
    }, {
      title: '运营活动名称',
      dataIndex: 'groupName',
      render: (text, record) => (record.groupName && record.groupName) || '--',
    }, {
      title: '操作',
      dataIndex: 'delete',
      render: (text, record) => (
        <Button className="btn-style"
          style={{ border: 'none', padding: 0, color: '#357aff', background: "transparent", fontSize: "12px" }}
          type="default"
          onClick={this.deleteGroup}
        >删除
        </Button>
      ),
    }]
    const { GroupModalVisible,CheckedItem } = this.state
    return (
      <div >
        <ModuleTitle title="PUSH通道及文案配置" />
        <div className="push-create-container">
          <Form onSubmit={this.onSubmit}>
            <Form.Item
              label="PUSH活动名称"
              {...formItemLayout}
              wrapperCol={{ span: 10 }}
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
              label="关联运营活动"
              {...formItemLayout}
              wrapperCol={{ span: 10 }}
            >
              {getFieldDecorator('marketing-activity')(
                <div>
                  <Button
                    type="primary"
                    style={{ marginBottom: '10px' }}
                    onClick={() => { this.visibleGroupChange(true) }}
                  >选择运营活动</Button>
                  <span
                    className="push-center-tip"
                  >
                   &nbsp;&nbsp; (代表一次运营活动，可在BOSS系统创建)
                  </span>
                  {selectedGroup &&
                    selectedGroup.length > 0 &&
                    <Table
                      columns={columns}
                      bordered
                      dataSource={selectedGroup}
                      pagination={false}
                      rowKey="id"
                    />}
                  <SelectLabelModal
                    visible={GroupModalVisible}
                    hideModal={() => { this.visibleGroupChange(false) }}
                    onChange={this.selectGroupChange}
                    deleteHidden={CheckedItem}
                  />
                </div>
              )}
            </Form.Item>
            {marketingCreate === 100 ?
              <Form.Item
                label="业务线"
                {...formItemLayout}
                wrapperCol={{ span: 4 }}
              >
                {getFieldDecorator('bizLine', {
                  initialValue: SeletedbizLine && SeletedbizLine,
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                })(
                  <Select placeholder="请选择业务线" onChange={this.selectedBizLine} disabled>
                    {PUSH_TOOL_BUSINESSES
                      && PUSH_TOOL_BUSINESSES.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>))}
                  </Select>,
                )}
              </Form.Item>
              :
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
                  <Select placeholder="请选择业务线" onChange={this.selectedBizLine}>
                    {PUSH_TOOL_BUSINESSES
                      && PUSH_TOOL_BUSINESSES.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>))}
                  </Select>,
                )}
              </Form.Item>

            }
            {
              (activatedTab === '2' || activatedTab === '3')
              && this.state.storeDetails && this.state.storeDetails.length > 0 &&
              <div className="ant-row ant-form-item">
                <div className="ant-col-4 ant-form-item-label">
                  <label htmlFor="pushRule" title="投放人群">投放人群</label>
                </div>
                <div className="ant-col-13 ant-form-item-control-wrapper">
                  <div className="ant-form-item-control has-success" >
                    {this.state.loading &&
                      <Spin />
                    }
                    {!this.state.loading && this.state.uploadFileName &&
                      [
                        <div>
                          <span style={{ marginRight: '2em' }}>{this.state.uploadFileName}</span>
                          <Icon
                            type="close-square"
                            style={{ color: 'rgb(24, 144, 255)' }}
                            onClick={this.deleteFile}
                          />
                          {/* <Icon
                            type="close"
                            style={{ fontSize: '12px' }}
                            onClick={this.deleteFile} /> */}
                        </div>,
                        <Table
                          style={{ textAlign: 'center' }}
                          size="small"
                          columns={tableColumns}
                          dataSource={this.state.storeDetails}
                          pagination={{ pageSize: 5 }}
                        />]
                    }
                  </div>
                </div>
              </div>
            }
            {
              (activatedTab === '2' || activatedTab === '3') &&
              <Form.Item
                label="商圈列表"
                {...formItemLayout}
              >
                <Upload
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
                  <span className="push-center-tip" onClick={e => e.stopPropagation()}>
                    （请上传txt、csv文件，目前只支持加油、维保）</span>
                </Upload>
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
                    <InputNumber style={{ width: '30%' }} />
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
              <Col span={20}>
                {(activatedTab === '1' || activatedTab === '4' || (activatedTab === '2'
                  && getFieldValue('pushRole') === '2')) &&
                  [<Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_DRIVER]}>
                    {getFieldDecorator('driverPush')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_DRIVER]} pushChannel={1} />,

                    )}
                  </Form.Item>,
                  ]
                }
                {(activatedTab === '1' || activatedTab === '4' || activatedTab === '3' || (activatedTab === '2'
                  && getFieldValue('pushRole') === '2')) &&
                  <Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]}>
                    {getFieldDecorator('driverBroadcast')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_BROADCAST]} pushChannel={3} />,
                    )}
                  </Form.Item>
                }
                {(activatedTab === '1' || activatedTab === '4' || (activatedTab === '2'
                  && getFieldValue('pushRole') === '1')) &&
                  <Form.Item>
                    {getFieldDecorator('passengerPush')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_PASSENGER]} pushChannel={2} />,
                    )}
                  </Form.Item>
                }
                {(activatedTab === '1' || activatedTab === '4') &&
                  <Form.Item key={PUSH_CHANNEL_MAP[PUSH_CHANNEL_MESSAGE_PASSENGER]}>
                    {getFieldDecorator('passengerMessage')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_MESSAGE_PASSENGER]} pushChannel={8} />,
                    )}
                  </Form.Item>
                }
                <Form.Item>
                  {getFieldDecorator('xiaojuPush')(
                    <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_XIAOJU]} pushChannel={6} />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('message')(
                    <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_MESSAGE]} pushChannel={4} />,
                  )}
                </Form.Item>
                {(activatedTab === '1' || activatedTab === '4') &&
                  <Form.Item>
                    {getFieldDecorator('coupon')(
                      <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_COUPON]} pushChannel={5} />,
                    )}
                  </Form.Item>
                }
                <Form.Item>
                  {getFieldDecorator('quanyi')(
                    <PushText text={PUSH_CHANNEL_MAP[PUSH_CHANNEL_PUSH_QUANYI]} pushChannel={9} />,
                  )}
                </Form.Item>

              </Col>
            </Row>
          </Form>
        </div>
        <SelectDocModal />
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
        <DeliveryStrategy onChange={this.selectedTagId}/> 
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            {marketingCreate === 100 ?
              <div></div>
              :
              <div>
                <Button
                  type="primary"
                  onClick={this.onSubmit}
                  style={{ marginRight: '2em', padding: '0 3em' }}
                >提交</Button>
                <Button
                  style={{ padding: '0 3em' }}
                  onClick={() => {
                    const { history } = this.props
                    history.push('/customer/push')
                  }}
                >取消</Button>
              </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}
export default connect(state => ({
  selectedTag: state.pushCenter.selectedTag,
  taskListParams: state.pushCenter.taskListParams,
  templateTag: state.pushCenter.templateTag,
  activatedTab: state.pushCenter.activatedTab,
  lockingState: state.pushCenter.lockingState,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushChannel))
