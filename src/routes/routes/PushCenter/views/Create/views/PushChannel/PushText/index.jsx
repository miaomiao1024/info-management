import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Radio,
  DatePicker,
  Button,
  Icon,
  message,
  Tooltip,
  Upload,
} from 'antd'
// import {
//   Link,
// } from 'react-router-dom'
import cookie from 'js-cookie'
import { actions } from '@modules/PushCenter'
import { 
  auth, 
  datef,
  sso 
} from '@didi/fate-common'
import PushTime from './PushTime'
import SelectCouponModal from './SelectCouponModal'
import SelectEquityModal from './SelectEquityModal'
import SelectTag from '../../SelectTag'
import LabelTextarea from '../../LabelTextarea'
import MobileDisplay from './MobileDisplay'


import {
  PUSH_PERIOD_TYPE_OPTIONS,
  PUSH_MESSAGE_TYPE_OPTIONS,
} from '../../../../../configs'

const { formatDate } = datef
const { toLogin } = sso
let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

class PushText extends Component {
  static propTypes = {
    onChange: T.func.isRequired,
    text: T.string.isRequired,
    actions: T.object.isRequired,
    pushChannel: T.number.isRequired,
    taskListParams: T.array.isRequired,
    selectedCoupon: T.array.isRequired,
    docModal: T.object.isRequired,
    templateTag: T.array.isRequired,
    pushRule: T.string.isRequired,
    menus: T.array.isRequired,
    activatedTab: T.string.isRequired,
    couponListParams: T.object.isRequired,
    selectedTag: T.array.isRequired,
    templateTagData: T.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      displayClassName: 'not-display',
      status: false,
      pushChannel: this.props.pushChannel,
      pushType: '2',
      imConfig:{
        action: '',
        imContent: '',
        imTitle: '',
        imageUrl: '',
        typeId: '1'
      },
      pushText: '',
      landingPage: '',
      originalLandingPage:'',
      startTime: '',
      endTime: '',
      fatigueStartTime: '',
      fatigueEndTime: '',
      fatigueTimeValue: [],
      ignoreGlobalFatigue: '0',
      pushTimes: [],
      pushPoint: '',
      dayType: 0,
      dayWeek: [],
      couponIds: '',
      size: 'default',
      visiableOpen:false,
    }
    this.messageTypeChange = this.messageTypeChange.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
  }
  componentWillMount() {
    const { setTaskListParams } = this.props.actions
    const tempList = this.props.taskListParams  //this.props.taskListParams为setTaskListParams返回的数组
    tempList[this.props.pushChannel] = this.state
    setTaskListParams(tempList)
  }
  
  componentWillReceiveProps(nextProps) {
    const { pushChannel, pushText ,imContent} = nextProps.docModal
    const activatedTab = nextProps.activatedTab
    const {
      docModal: {
        pushText: prePushText,
        imContent: preImContent,
      },
      pushChannel: prePushChannel,
    } = this.props
    if (pushChannel === prePushChannel && imContent !== preImContent){
      let messageInfo = this.state.imConfig
      messageInfo.imContent = imContent 
      this.setState({imConfig:messageInfo})
      this.triggerChange({imConfig:messageInfo})
    }
    if (pushChannel === prePushChannel && pushText !== prePushText) {
      this.setState({ pushText })
      this.triggerChange({ pushText })    
    }

    if (activatedTab === '3') {
      PUSH_PERIOD_TYPE_OPTIONS[0].disabled = true
      this.setState({pushType: '3'})
      this.triggerChange({ pushType: '3' })
    } else {
      PUSH_PERIOD_TYPE_OPTIONS[0].disabled = false
    }

  }


  //改变checkbox的函数  e--json串  e.target.checked---true/false
  handleStatusChange = (e) => {
    const value = e.target.checked
    const {pushChannel} = this.props
    if (pushChannel === 6) {
      const { selectedTag, actions: { setSelectedTag, isXiaojuPushChecked } } = this.props
      if (value) {
        if (selectedTag.length > 0 && selectedTag[0].idType.id !== '3') {
          message.error("该人群包不适用于小桔车服端外PUSH通道")
          setSelectedTag([])
          this.ScrollTop(300, 200)
          // document.body.scrollTop = document.documentElement.scrollTop = 0
        }
      }
      isXiaojuPushChecked(value)
    }
    if(pushChannel === 9){
      if(!e.target.checked){
        const { actions:{saveSelectRow} } = this.props
        saveSelectRow([])
      }
      //已选择权益后不允许删除运营活动
      const {actions:{lockingEquitySelected}} = this.props
      lockingEquitySelected(e.target.checked)
    }
    this.setState({ status: value })
    this.statusChange({ status: value })
    this.setState({ displayClassName: value ? '' : 'not-display' })  //设置push内容是否显示
  }
  // 回到顶端
  ScrollTop = (number = 0, time) => {
    if (!time) {
      document.body.scrollTop = document.documentElement.scrollTop = number
      return number
    }
    const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime // 计算循环的次数
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
    let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--
        this.ScrollTop(nowTop += everTop)
      } else {
        clearInterval(scrollTimer) // 清除计时器
      }
    }, spacingTime)
  }

  //改变文案类型
  triggerChange = (changedValue) => {
    const { actions : { setTaskListParams } } = this.props
    const tempList = this.props.taskListParams //tempList为一个数组，存放每个checkbox的值，由pushChannel辨识
    tempList[this.props.pushChannel] = Object.assign({}, tempList[this.props.pushChannel], changedValue) 
    setTaskListParams(tempList)//setTaskListParams将数据经由redux比较并返回更改后的 state
  }
  //改变‘类型’的redio函数  pushType=2(单词推送) pushType=3(周期自动推送)
  handleTypeChange = (e) => {
    this.setState({ pushType: e.target.value })
    this.triggerChange({ pushType: e.target.value })
    if (this.props.text === '优惠券') {
      console.log("选择了优惠卷")
      const { setCouponSelectType, setSelectedCoupon } = this.props.actions
      setCouponSelectType(e.target.value)
      this.triggerChange({ couponIds: [] })
      setSelectedCoupon([])
    }
  }

  //改变“消息类型”的redio函数 typeId=1(文本推送)typeId=2(图文推送)
  messageTypeChange = (event) => {
    let messageInfo = this.state.imConfig
    messageInfo.typeId = event.target.value 
    if(event.target.value === '1'){
      messageInfo.imageUrl = ''
      this.setState({imConfig:messageInfo})
    }
    this.setState({imConfig:messageInfo})
    this.triggerChange({imConfig:messageInfo})
  }
  //消息标题改变-->实时反应在右侧手机上
  messageTitleChange = (event) => {
    let messageInfo = this.state.imConfig
    messageInfo.imTitle = event.target.value
    this.setState({imConfig :messageInfo})
    this.triggerChange({ imConfig: messageInfo})
  }
  //上传图片
  handleImageChange(info) {
    const file = info.file
    if (file.status === 'done') {
      if (file.response && file.response.status === 10000) {
        let messageInfo = this.state.imConfig
        messageInfo.imageUrl = file.response.data
        this.setState({imConfig :messageInfo})
        //console.log(this.state.imConfig.imageUrl)
        this.triggerChange({imConfig :messageInfo})
        message.success(`${file.name}上传成功`)          
      } else {
        message.error(file.response.msg)
      }
    } else if (info.file.status === 'error') {
      message.error(`${file.name}上传失败`)
    }   
  }
  //push文案
  handleContentChange = (event) => {
    const regx = /\n+/g
    if(regx.test(event)){
      message.error('PUSH文案不允许换行')
    }
    let messageInfo = this.state.imConfig
    const str = event.replace(/\n+/g,"")
    messageInfo.imContent = str
    this.setState({imConfig :messageInfo})
    this.triggerChange({ imConfig: messageInfo})
  }
  //落地页
  handleActionChange = (event) => {
    let messageInfo = this.state.imConfig
    messageInfo.action = event.target.value
    this.setState({imConfig :messageInfo})
    this.triggerChange({ imConfig: messageInfo})
  }

  handleGlobalFatigueChange = (e) => {
    this.setState({ ignoreGlobalFatigue: e.target.value })
    this.triggerChange({ ignoreGlobalFatigue: e.target.value })
  }
  handleTextChange = (value) => {
    const regx = /\n+/g
    if(regx.test(value)){
      message.error('PUSH文案不允许换行')
    }
    value = value.replace(/\n+/g,"")
    this.setState({ pushText: value })
    this.triggerChange({ pushText: value })
  }

  handleLandingPageChange = (e) => {
    this.setState({ landingPage: e.target.value })
    this.triggerChange({ landingPage: e.target.value })
  }
  originalLandingPageChange = (e) => {
    this.setState({ originalLandingPage: e.target.value })
    this.triggerChange({ originalLandingPage: e.target.value })
  }
  
  pushTextJudge = (e) => {
    const { pushChannel } = this.props
    if (pushChannel === 4) {
      if (e.target.value && e.target.value.length > 60) {
        message.error('短信不超过60个汉字')
        const pushText = document.getElementById(`pushText${pushChannel}`)
        pushText.focus()
      }
    } else {
      if (e.target.value && e.target.value.length > 240) {
        message.error('PUSH文案不超过240个汉字')
        const pushText = document.getElementById(`pushText${pushChannel}`)
        pushText.focus()
      // input.setSelectionRange(0, input.value.length)
      }
    }

  }
  landingPageJudge = (e) => {
    const patt = /^https?:\/\/.+/
    const {pushChannel} = this.props
    if (e.target.value && !patt.test(e.target.value)) {
      message.error('请输入合法PUSH落地页链接')
      // this.refs.landingPage.focus()
      const landingPage = document.getElementById(`landingPage${pushChannel}`)
      landingPage.focus()
      // input.setSelectionRange(0, input.value.length)
    }
  }

  // 单次推送-->选定PUSH时间（单位毫秒/一次性PUSH必传）
  handlePushTimesChange = (date) => {
    if (date) {
      this.setState({ pushTimes: [`${date.toDate().getTime()}`] })
      this.triggerChange({ pushTimes: [`${date.toDate().getTime()}`] })
    } else {
      this.setState({ pushTimes: [''] })
      this.triggerChange({ pushTimes: [''] })
    }
  }
  //周期推送-->设置推送有效期 函数
  
  handlePeriodOk = (date) => {
    window.event.stopPropagation()
    if (date.length > 0) {
      const dateDiff = date[1].toDate().getTime() - date[0].toDate().getTime()
      const dayDiff = Math.floor(dateDiff/(24 * 3600 * 1000))
      if(dayDiff > 180){
        message.warn("推送有效期必须小于半年！")
        this.setState({visiableOpen:true})
      }else{
        this.setState({visiableOpen:false})
        this.setState({ startTime: date[0].toDate().getTime() })
        this.setState({ endTime: date[1].toDate().getTime() })
        this.triggerChange({ startTime: date[0].toDate().getTime() })
        this.triggerChange({ endTime: date[1].toDate().getTime() })
      }
    }
  }
  handleFatigueChange = (date) => {
    const { startTime, endTime } = this.state
    const fatigueStartTime = date[0].toDate().getTime()
    const fatigueEndTime = date[1].toDate().getTime()
    if (date.length > 0) {
      if (!startTime || !endTime) {
        message.error('请先选择推送有效期')
        this.setState({ fatigueTimeValue: [] })
        return
      }
      this.setState({ fatigueTimeValue: date })
      this.setState({ fatigueStartTime })
      this.setState({ fatigueEndTime })
      this.triggerChange({ fatigueStartTime: date[0].toDate().getTime() })
      this.triggerChange({ fatigueEndTime: date[1].toDate().getTime() })
    }
  }
  /* handleFatigueChange = (date) => {
    const { startTime, endTime } = this.state
    const fatigueStartTime = date[0].toDate().getTime()
    const fatigueEndTime = date[1].toDate().getTime()
    if (date.length > 0) {
      if (!startTime || !endTime) {
        message.error('请先选择推送有效期')
        this.setState({ fatigueTimeValue: [] })
        return
      } else if (fatigueStartTime < startTime || fatigueEndTime > endTime) {
        message.error('疲劳度控制时间必须在推送有效期')
        this.setState({ fatigueTimeValue: [] })
        return
      }
      this.setState({ fatigueTimeValue: date })
      this.setState({ fatigueStartTime })
      this.setState({ fatigueEndTime })
      this.triggerChange({ fatigueStartTime: date[0].toDate().getTime() })
      this.triggerChange({ fatigueEndTime: date[1].toDate().getTime() })
    }
  } */
  
  //传入某一通道是否打通true/false。给onchange传入{status:true,pushChannel:1}对象
  statusChange = (changedValue) => {
    const onChange = this.props.onChange
    if (onChange) {
      const state = this.state
      const values = {
        status: state.status,
        pushChannel: this.props.pushChannel,
      }
      onChange(Object.assign({}, values, changedValue))
    }
  }
  // 人群包
  selectedTagChange = (selectedTag) => {
    this.triggerChange({userTagId: selectedTag[0].tagId})
  }

  render() {
    const mobileParams = this.props.taskListParams[8]
    const labelCol = { span: 4 }
    const itemCol = { span: 20 }
    const {size, status,visiableOpen,displayClassName} = this.state
    const fatigueTimeValue = this.state.fatigueTimeValue
    const { pushRule, menus, activatedTab, couponListParams, selectedCoupon, pushChannel,selectedEquity } = this.props
    const textPlaceholder = pushChannel !== 4 ? '请输入PUSH文案，不超过240个汉字' : '请输入短信内容，不超过60个汉字'   
    const {mobileTitle:{name},saveData} = this.props
    let isPushChannel = false
    if(pushChannel === 9 && saveData && saveData.length === 0){
      isPushChannel = true
    }
    return (
      <div className="push-text">
        <Row>
          <Col>
            <Checkbox
              onChange={this.handleStatusChange}
              disabled={isPushChannel}
            >{this.props.text}</Checkbox>
            { pushChannel === 4 &&
                <span 
                  className="push-center-tip"
                  onClick={e=> e.stopPropagation()}
                >
              (系统会自动在文案末尾加上"TD退订"字样，无需手动添加)
                </span>
            }
            { pushChannel === 5 &&
                <span 
                  className="push-center-tip"
                  onClick={e=> e.stopPropagation()}
                >
              (该功能为异步全量绑券，短信、端外等触达通道不能起到绑券提醒等作用)
                </span>
            }
            { pushChannel === 8 &&
                <span 
                  className="push-center-tip"
                  onClick={e=> e.stopPropagation()}
                >
              (确保该业务线对应的消息号已开通，
                  <a target="view_window"
                    href='http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=203703275'>查看详情</a>)
                </span>
            }
          </Col>
        </Row>
        <Row className={displayClassName}>
          <Col span={18}>
            <div style={{ background: '#fafafa', padding: '1em'}}>
              <Row>
                {activatedTab === '4' &&
                status &&
                  <SelectTag onChange={this.selectedTagChange} />
                }
              </Row>
              <Row>
                <Col {...labelCol}><label>类型</label></Col>
                <Col {...itemCol}>
                  <Radio.Group onChange={this.handleTypeChange} value={this.state.pushType}>
                    {PUSH_PERIOD_TYPE_OPTIONS.map(cur => 
                      (<Radio key={cur.id} value={cur.id} disabled={cur.disabled}>{cur.name}</Radio>),
                    )}
                  </Radio.Group>
                </Col>
              </Row>
              {pushChannel === 8 &&
                <Row>
                  <Col {...labelCol}><label>消息标题</label></Col>
                  <Col {...itemCol}>
                    <Input
                      placeholder="请输入发送消息标题"
                      value={this.state.imConfig.imTitle}
                      onChange={this.messageTitleChange}
                      //onBlur={this.landingPageJudge}
                      // ref="landingPage"
                      //id={`landingPage${pushChannel}`}
                    />
                  </Col>
                </Row>
              }
              {pushChannel === 8 &&
                <Row>
                  <Col {...labelCol}><label>消息类型</label></Col>
                  <Col {...itemCol}>
                    <Radio.Group onChange={this.messageTypeChange} value={this.state.imConfig.typeId}>
                      {PUSH_MESSAGE_TYPE_OPTIONS.map(cur => 
                        (<Radio key={cur.id} value={cur.id} disabled={cur.disabled}>{cur.name}</Radio>),
                      )}
                    </Radio.Group>
                  </Col>
                </Row>
              }
              {pushChannel === 8 && this.state.imConfig.typeId === '2' &&
                <Row>
                  <Col {...labelCol}><label>消息图片</label></Col>
                  <Col {...itemCol}>
                    <Upload name="files" action="/api/push/activity/upload/img" listType="picture"
                      showUploadList={false}
                      onChange={this.handleImageChange}
                    >
                      <Button><Icon type="upload" /> <span style={{fontSize:'12px'}}>请上传图片</span></Button>          
                      <span onClick={e => e.stopPropagation()} style={{fontSize:'12px',color:'red',marginLeft:'10px'}}>
                        * 图片大小必须是W:710 H:264
                      </span>
                    </Upload>
                  </Col>
                </Row>
              }
              {
                this.state.pushType === '3' && 
              <Row>
                <Col {...labelCol}><label>推送有效期</label></Col>
                <Col {...itemCol} 
                  onClick= {(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if(!visiableOpen){
                      this.setState({visiableOpen:true})
                    }
                  }}
                >
                  <DatePicker.RangePicker
                    placeholder={['开始时间', '结束时间']}
                    format="YYYY-MM-DD HH:mm:ss"
                    allowClear
                    showTime
                    //onChange={this.handlePeriodChange}
                    onOk={this.handlePeriodOk}
                    open={visiableOpen}
                  />
                </Col>
              </Row>
              }
              <Row>
                <Col {...labelCol}><label>PUSH时间</label></Col>
                {
                  this.state.pushType === '2'
                    ?
                    <Col {...itemCol}><DatePicker
                      onChange={this.handlePushTimesChange}
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime
                      disabledDate={this.disabledStartDate}
                    /></Col>
                    : 
                    <PushTime onPeriodTimeChange={this.triggerChange} />
                }
              </Row>
              
              {pushChannel === 5 || pushChannel === 9
                ? <div>
                  {pushChannel === 5 &&
                  <Row>
                    <Col {...labelCol}><label>优惠券</label></Col>
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => {
                          const { setCouponModal, fetchPushToolCouponList } = this.props.actions
                          fetchPushToolCouponList(couponListParams)
                          setCouponModal(true)
                        }}
                      >选择优惠券</Button>
                      <SelectCouponModal onChange={this.triggerChange} />
                      <table style={{ width: '100%', textAlign: 'center', lineHeight: '3em', marginTop: '2em' }} >
                        <thead>
                          <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                            <td style={{ minWidth: '5em' }}>优惠券ID</td>
                            <td style={{ minWidth: '5em' }}>业务线</td>
                            <td style={{ minWidth: '6em' }}>券活动名称</td>
                            <td style={{ minWidth: '4em' }}>券面额</td>
                            <td style={{ minWidth: '4em' }}>券余额</td>
                            <td style={{ minWidth: '7em' }}>活动起止时间</td>
                            <td style={{ minWidth: '4em' }}>券状态</td>
                            <td style={{ minWidth: '5em' }}>预算归属</td>
                            <td style={{ minWidth: '3em' }}>操作</td>
                          </tr>
                        </thead>
                        <tbody style={{ background: 'white' }}>
                          {selectedCoupon.length === 0
                            ? <tr>
                              <td style={{ color: 'rgba(0, 0, 0, 0.43)' }} colSpan={9}>
                                <i className="anticon anticon-frown-o" style={{ marginRight: '4px' }} />暂无数据
                              </td>
                            </tr>
                            : selectedCoupon.map((coupon, index) => (
                              <tr key={index}>
                                <td>{coupon.couponId}</td>
                                <td>{coupon.bizLine && coupon.bizLine.name}</td>
                                <td>{coupon.activityName}</td>
                                <td>{coupon.discount / 100}</td>
                                <td>{coupon.budgetBalance / 100}</td>
                                <td>
                                  <p style={{ lineHeight: 1.4 }}>{formatDate(coupon.startTime)}</p>
                                  <p style={{ lineHeight: 1.4 }}>{formatDate(coupon.endTime)}</p>
                                </td>
                                <td>{coupon.status && coupon.status.name}</td>
                                <td>{coupon.section && coupon.section.name}-{coupon.subSection 
                                  && coupon.subSection.name}</td>
                                <td>
                                  {/* <Link to={`/activity/coupon/detail/${coupon.couponId}`}>
                                    <span>详情</span>
                                  </Link> */}
                                  <div>
                                    <a
                                      onClick={(e)=>{
                                        e.preventDefault()
                                        const {setSelectedCoupon} = this.props.actions
                                        const selectedCoupon1 = selectedCoupon.filter(item => 
                                          item.couponId!== coupon.couponId)
                                        setSelectedCoupon(selectedCoupon1)
                                        const couponIds = selectedCoupon1.map(coupon => coupon.couponId)
                                        this.triggerChange({couponIds})
                                      }}>
                                    删除
                                    </a>
                                  </div>

                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </Col>
                  </Row>}
                  {pushChannel === 9 &&
                  <Row>
                    <Col {...labelCol}><label>权益</label></Col>
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => {
                          const { setEquityModal } = this.props.actions
                          setEquityModal(true)
                        }}
                      >选择权益</Button>
                      <SelectEquityModal onChange={this.triggerChange}/>
                      <table style={{ width: '100%', textAlign: 'center', lineHeight: '3em', marginTop: '2em' }} >
                        <thead>
                          <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}>
                            <td style={{ minWidth: '7em' }}>权益ID</td>
                            <td style={{ minWidth: '7em' }}>权益名称</td>
                            <td style={{ minWidth: '8em' }}>权益描述</td>
                            <td style={{ minWidth: '5em' }}>操作</td>
                          </tr>
                        </thead>
                        <tbody style={{ background: 'white' }}>
                          {selectedEquity.length === 0
                            ? <tr>
                              <td style={{ color: 'rgba(0, 0, 0, 0.43)' }} colSpan={9}>
                                <i className="anticon anticon-frown-o" style={{ marginRight: '4px' }} />暂无数据
                              </td>
                            </tr>
                            : selectedEquity.map((coupon, index) => (
                              <tr key={index}>
                                <td>{coupon.id}</td>
                                <td>{coupon.prizeName}</td>
                                <td>{coupon.prizeDesc}</td>
                                <td>                                
                                  <a
                                    onClick={(e)=>{
                                      e.preventDefault()
                                      const {actions: {saveSelectRow}} = this.props
                                      saveSelectRow([])
                                      this.triggerChange({ couponIds:[]})
                                    }}>
                                    删除
                                  </a>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </Col>
                  </Row>}
                </div>
                : 
                <div>
                  {pushChannel === 8 
                    ?
                    <Row>
                      <Col {...labelCol}><label>PUSH文案</label></Col>
                      <Col {...itemCol}>
                        <div className="push-text-tag">
                          <Row type="flex" justify="space-around" align="middle">
                            <Col span={24}>
                              <div className="push-text-tag-input">
                                <Row>
                                  <Col span={19}>
                                    <LabelTextarea
                                      onChange={this.handleContentChange}
                                      value={this.state.imConfig.imContent}
                                      onBlur={this.pushTextJudge}
                                      placeholder={textPlaceholder}
                                      pushChannel={pushChannel}                                     
                                    />
                                  </Col>
                                  <Col
                                    span={4}
                                    style={{ marginLeft: 3 }}
                                  >
                                    {(auth(menus, '/api/push/activity/template/labels')) && activatedTab !== '3' &&
                                  <Button
                                    size={size}
                                    style={{ marginLeft: 5 }}
                                    onClick={
                                      () => {
                                        const { 
                                          actions: { 
                                            setDocModal, setTemplateTag, setPreTemplateTag },
                                          pushChannel, templateTag } = this.props
                                        // if (templateTagData.length === 0) {
                                        //   fetchPushToolTemplateTag()
                                        // }
                                        const { imConfig : { imContent } } = this.state
                                        setDocModal({ visiable: true, pushChannel, imContent })
                                        let templateTagTem = Array.from(templateTag)
                                        templateTagTem = templateTagTem.map((item) => {
                                          const reg = new RegExp(`{${item.labelName}}`, 'ig')
                                          const matchs = imContent.match(reg) || []
                                          if (matchs.length > 0) {
                                            return { ...item, checkedCount: matchs.length }
                                          }
                                          return { ...item }
                                        })
                                        setTemplateTag(templateTagTem)
                                        setPreTemplateTag(templateTagTem)
                                      }
                                    }
                                  >使用标签创建</Button>
                                    }
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                    :
                    <Row>
                      <Col {...labelCol}><label>PUSH文案</label></Col>
                      <Col {...itemCol}>
                        <div className="push-text-tag">
                          <Row type="flex" justify="space-around" align="middle">
                            <Col span={24}>
                              <div className="push-text-tag-input">
                                <Row>
                                  <Col span={19}>
                                    <LabelTextarea
                                      onChange={this.handleTextChange}
                                      value={this.state.pushText}
                                      onBlur={this.pushTextJudge}
                                      placeholder={textPlaceholder}
                                      pushChannel={pushChannel}
                                    />
                                  </Col>
                                  <Col
                                    span={4}
                                    style={{ marginLeft: 3 }}
                                  >
                                    {(auth(menus, '/api/push/activity/template/labels')) && activatedTab !== '3' &&
                                  <Button
                                    size={size}
                                    style={{ marginLeft: 5 }}
                                    onClick={
                                      () => {
                                        const { 
                                          actions: { 
                                            setDocModal, setTemplateTag, setPreTemplateTag },
                                          pushChannel, templateTag } = this.props
                                        // if (templateTagData.length === 0) {
                                        //   fetchPushToolTemplateTag()
                                        // }
                                        const { pushText } = this.state
                                        setDocModal({ visiable: true, pushChannel, pushText })
                                        let templateTagTem = Array.from(templateTag)
                                        templateTagTem = templateTagTem.map((item) => {
                                          const reg = new RegExp(`{${item.labelName}}`, 'ig')
                                          const matchs = pushText.match(reg) || []
                                          if (matchs.length > 0) {
                                            return { ...item, checkedCount: matchs.length }
                                          }
                                          return { ...item }
                                        })
                                        setTemplateTag(templateTagTem)
                                        setPreTemplateTag(templateTagTem)
                                      }
                                    }
                                  >使用标签创建</Button>
                                    }
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  }
                  
                  {pushChannel !== 4 && pushRule !== '2' && pushChannel !== 8 &&
                  <Row>
                    <Col {...labelCol}><label>消息落地页</label></Col>
                    <Col {...itemCol}>
                      <Input
                        onChange={this.handleLandingPageChange}
                        placeholder="请输入PUSH落地页链接"
                        onBlur={this.landingPageJudge}
                        // ref="landingPage"
                        id={`landingPage${pushChannel}`}
                      />
                    </Col>
                  </Row>
                  }
                  {pushChannel === 8 &&
                  <Row>
                    <Col {...labelCol}><label>消息落地页</label></Col>
                    <Col {...itemCol}>
                      <Input
                        onChange={this.handleActionChange}
                        placeholder="请输入PUSH落地页链接"
                        onBlur={this.landingPageJudge}
                        value={this.state.imConfig.action}
                        // ref="landingPage"
                        id={`landingPage${pushChannel}`}
                      />
                    </Col>
                  </Row>
                  }
                  {pushChannel !== 5 && pushChannel !== 9 &&
                  <Row>
                    <Col {...labelCol}><label>原始长链接</label></Col>
                    <Col {...itemCol}>
                      <Input
                        onChange={this.originalLandingPageChange}
                        placeholder="请输入PUSH原始长链接"
                        onBlur={this.landingPageJudge}
                        // ref="landingPage"
                        id={`landingPage${pushChannel}`}
                      />
                    </Col>
                  </Row>

                  }
                  {user && user.roleList.indexOf('push_fatigue') !== -1
                && 
                  <div>
                    <Row>
                      <Col {...labelCol}>
                        <label>
                          <Tooltip
                            title={<div style={{ width: '15em' }}>在生效周期内忽略全局疲劳度控制</div>}
                          >
                            忽略疲劳度控制
                            <Icon type="question-circle" theme="outlined" />
                          </Tooltip>
                        </label>
                      </Col>
                      <Col {...itemCol}>
                        <Radio.Group onChange={this.handleGlobalFatigueChange} value={this.state.ignoreGlobalFatigue}>
                          <Radio value="1">是</Radio>
                          <Radio value="0">否</Radio>
                        </Radio.Group>
                      </Col>
                      {this.state.ignoreGlobalFatigue === '1' && this.state.pushType === '3'
                      && <Col {...itemCol} offset={4}>
                        <DatePicker.RangePicker
                          placeholder={['忽略疲劳度控制开始时间', '忽略疲劳度控制结束时间']}
                          format="YYYY-MM-DD HH:mm:ss"
                          allowClear
                          showTime
                          value={fatigueTimeValue}
                          // value={[moment(fatigueStartTime, 'YYYY-MM-DD HH:mm:ss'),
                          //   moment(fatigueEndTime, 'YYYY-MM-DD HH:mm:ss')]}
                          onChange={this.handleFatigueChange}
                        />
                      </Col>
                      }
                    </Row>
                  </div>
                  }
                </div>
              }              
            </div>
          </Col>
          {pushChannel === 8 &&
            <Col span={6}>
              <MobileDisplay text={mobileParams} mobileTitle={name} />
            </Col>
          }
        </Row>

        
      </div>
    )
  }
}

export default connect(state => ({
  isShowCouponModal: state.pushCenter.isShowCouponModal,
  taskListParams: state.pushCenter.taskListParams,
  selectedCoupon: state.pushCenter.selectedCoupon,
  docModal: state.pushCenter.docModal,
  templateTag: state.pushCenter.templateTag,
  pushRule: state.pushCenter.pushRule,
  // menus: state.common.menus.menus.data,
  activatedTab: state.pushCenter.activatedTab,
  menus: state.common.features.data,
  couponListParams: state.pushCenter.couponListParams,
  selectedTag: state.pushCenter.selectedTag,
  templateTagData: state.pushCenter.templateTagData.data,
  mobileTitle: state.pushCenter.mobileTitle,
  saveData: state.pushCenter.saveData,
  selectedEquity:state.pushCenter.selectedEquity,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushText))

