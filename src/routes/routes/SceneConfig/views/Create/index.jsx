import React, { Component } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Tooltip,
  message,
} from 'antd'
import T from 'prop-types'
import {
  bindActionCreators
} from 'redux'
import {
  fetch,
} from '@didi/fate-common'
import {
  connect,
} from 'react-redux'
import { actions } from '@modules/SceneConfig'
import { PageTitle } from '@components'
import Geofence from './Geofence'
import SceneStrategy from './SceneStrategy'
import './index.styl'
import moment from 'moment'
import { 
  PUSH_TOOL_BUSINESSES,
  SCENE_CONFIG_USER_TYPE,
  SCENE_CONFIG_USER_TYPE_DRIVER,
} from '../../configs'

const { TextArea } = Input
const RangePicker = DatePicker.RangePicker
const RadioGroup = Radio.Group
let arr = []

class SceneCreate extends Component {
  static propTypes = {
    history: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      sceneType:'2',
      eventTypeValue:null,
      isDisabled:false,
      filteritems:[],
      
    }
  }
  
  //长期有效的checkbox
  onChangeCheckbox = (e) => {
    if(e.target.checked){
      this.setState({isDisabled:true})
    }else{
      this.setState({isDisabled:false})
    }
  }

  //选择业务线函数
  selectSceneBizLine = (value) => {
    const{
      form: { setFieldsValue }
    } = this.props
    setFieldsValue({ eventId: undefined })
    if(value === undefined){
      const { actions: { getSceneConfigEventType,getEventTypeDetail } } = this.props
      getSceneConfigEventType(null,true)
      getEventTypeDetail(null,true)
    }else{
      const { actions: { getSceneConfigEventType } } = this.props
      getSceneConfigEventType(value)
    }
  }

  //选择事件类型函数
  selectEventType = (value) => {
    this.setState({eventTypeValue:value})
    if(value === undefined){
      const { actions: { getEventTypeDetail } } = this.props
      getEventTypeDetail(null,true)
    }else{
      const { actions: { getEventTypeDetail } } = this.props
      getEventTypeDetail(value)
    }
  }
  //提交表单
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      eventTypeDetail,
    } = this.props
    const values = form.getFieldsValue()
    const { getFieldValue } = form
    if(values.fixedTime){
      const date = new Date()
      date.setMinutes(date.getMinutes() + 20) 
      values.startTime = date.valueOf()
      date.setFullYear(date.getFullYear() + 1);
      values.endTime = date.valueOf()
    }else if (!values.fixedTime && values.createTime && values.createTime.length === 2) {
      if (values.createTime[0]) {
        values.startTime = values.createTime[0] && `${values.createTime[0].toDate().getTime()}`
      }
      if (values.createTime[1]) {
        values.endTime = values.createTime[1] && `${values.createTime[1].toDate().getTime()}`
      }
      if (!values.startTime && values.endTime) {
        message.error('没有输入开始时间')
        return
      }
      if (values.startTime && !values.endTime) {
        message.error('没有输入结束时间')
        return
      }
      
    }else{
      message.error('请填写有效期')
      return
    }
    if (!getFieldValue('sceneName')) {
      message.error('请输入场景名称')
      return
    }
    if (!getFieldValue('sceneDesc')) {
      message.error('请输入场景描述')
      return
    }
    if (!getFieldValue('bizLine')) {
      message.error('请选择业务线')
      return
    }
    if (!getFieldValue('eventId')) {
      message.error('请选择事件类型')
      return
    }
    const eventItems = eventTypeDetail
    const firstItems = eventItems.map((item) => {
      return {
        ...item
      }
    })
    const items = firstItems.map((item) => {
      delete item.ruleName
      delete item.ruleNameZh
      delete item.ruleOption
      delete item.ruleType
      delete item.valueType
      item.symbol = JSON.parse(item.symbolOption)[0]
      delete item.symbolOption
      return item
    })
    const {filteritems} = this.state
    if(filteritems.length !== items.length){
      message.info("事件类型标签为必选项")
      return
    }else{
      for(let i=0;i<items.length;i++){
        items[i].value = `${filteritems[i]}`
      }
    }
    delete values.createTime
    delete values.fixedTime
    delete values.filter
    const rules = {}
    rules.items = items
    rules.logicType = "and"
    values.filterRules = rules
    console.log(values)
    fetch('/api/scene/submit', {
      method: 'POST',
      data: values,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        message.success("创建成功")
        const { history } = this.props
        history.push('/customer/scene')
      } else if (res && res.status !== 10000) {
        message.error("创建失败")
      }
    }) 
  }
  
  selectFilterRules = (value,index) => {
    arr[index]= value.target.value
    this.setState({filteritems:arr})
  }

  render() {
    const createFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    }
    const createFormLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 6 },
    }
    const createTimeFormLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    }

    const { 
      form : { getFieldDecorator } ,
      eventTypeList,
      eventTypeDetail
    } = this.props
    const { 
      sceneType,
      eventTypeValue,
      isDisabled,
    } = this.state
    let eventTypeName
    if(eventTypeList.list){
      eventTypeName = eventTypeList.list.find(value =>
        value.id === eventTypeValue)
    }
    return (
      <div className="scene-config-create-page">
        <PageTitle titles={['场景配置', '新增场景']} />
        <div className='scene-config-create-container'>
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              {...createFormItemLayout}
              label="场景名称"
            >
              {getFieldDecorator('sceneName', {
                rules: [{
                  required: true,
                  message: "请输入场景名称",
                }],
              })(
                <Input
                  placeholder="请输入场景名称，不超过50个汉字"
                />,
              )}
            </Form.Item>
            <Form.Item
              {...createFormItemLayout}
              label="场景描述"
            >
              {getFieldDecorator('sceneDesc', {
                rules: [{
                  required: true,
                  message: "请输入场景描述",
                }],
              })
              (
                <TextArea placeholder="请输入场景描述" autosize={{ minRows: 3, maxRows: 6 }} />
              )}
            </Form.Item>
            <Form.Item
              {...createFormLayout}
              label="业务线"
            >
              {getFieldDecorator('bizLine', {
                rules: [{
                  required: true,
                  message: "请选择选择业务线",
                }]
              })(
                <Select placeholder="请选择选择业务线" onChange={this.selectSceneBizLine} allowClear>
                  {
                    PUSH_TOOL_BUSINESSES
                    && PUSH_TOOL_BUSINESSES.map(cur => (
                      <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                    ))
                  }
                </Select>,
              )}
            </Form.Item>
            <Form.Item
              {...createFormLayout}
              label="用户类型"
            >
              {getFieldDecorator('userRole', {
                rules: [{
                  required: true,
                  message: '必选',
                }],
                initialValue: SCENE_CONFIG_USER_TYPE_DRIVER,
              })(
                <Radio.Group>
                  {
                    SCENE_CONFIG_USER_TYPE.map(cur => (
                      <Radio key={cur.id} value={cur.id}>{cur.name}</Radio>
                    ))
                  }
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item
              {...createTimeFormLayout}
              label="有效期"
            >
              {getFieldDecorator('createTime',{
                rules: [{
                  required: true,
                  message: '请选择时间',
                }],
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  allowClear
                  style={{marginRight:'10px'}}
                  disabled={isDisabled}
                />,
              )}
              {getFieldDecorator('fixedTime',{
                rules: [{
                  required: true,
                  message: '请选择时间',
                }],
              })(
                <Checkbox onChange={this.onChangeCheckbox}>长期有效</Checkbox>,
              )}
            </Form.Item>
            <Form.Item
              {...createFormLayout}
              label="事件类型"
            >
              <Tooltip title="请先选择业务线">
                {getFieldDecorator('eventId', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                })(
                  <Select placeholder="请选择事件类型" onChange={this.selectEventType} allowClear>
                    {
                      eventTypeList.list
                    && eventTypeList.list.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.eventNameZh}</Select.Option>
                    ))
                    }
                  </Select>,
                )}
              </Tooltip>
            </Form.Item>
            {eventTypeList.list && eventTypeDetail.length > 0 && eventTypeName && eventTypeName.eventNameZh &&
              <Form.Item
                {...createFormItemLayout}
                label={eventTypeName.eventNameZh}
              >
                {getFieldDecorator('filter', {
                  rules: [{
                    required: true,
                    message: '必选',
                  }],
                })(
                  <div className="border-event-type">
                    { 
                      eventTypeDetail && eventTypeDetail.map((item,index)=> (
                        <Row> 
                          <Col offset={1}>
                            <label style={{marginRight:"15px"}}>{item.ruleNameZh}</label>
                            <RadioGroup
                              key={index}
                              onChange={(value) => this.selectFilterRules(value,index)}
                            >
                              {item.ruleOption && 
                          JSON.parse(item.ruleOption).map((cur) => (
                            <Radio key={cur.value} value={cur.value}>
                              {cur.name}
                            </Radio>
                          )) 
                              }
                            </RadioGroup>
                          </Col>
                        </Row>
                      ))
                    }
                  </div>,
                )}
                
              </Form.Item>
            }

            {sceneType === '1' ? 
              <Geofence />
              :
              <div></div>
            }
            {/* <Form.Item
              {...createFormLayout}
              label="场景策略"
            >
              {getFieldDecorator('sceneStrategy', {
                rules: [{
                  required: true,
                  message: '必选',
                }],
              })(          
                <SceneStrategy />
              )}
            </Form.Item> */}
            <section className="operator-container">
              <div style={{ textAlign: 'center'}}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="default"
                >提交
                </Button>
                <Button
                  style={{ marginLeft: 28 }}
                  size="default"
                  onClick={() => {
                    const {
                      history,
                    } = this.props
                    history.push('/customer/scene')
                  }}
                >取消
                </Button>
              </div>
            </section>
          </Form>
        </div>
      </div>
    )
  }
}

//export default (Form.create()(SceneCreate))
export default connect(
  state => ({
    eventTypeList: state.sceneConfig.eventTypeList.data,
    eventTypeDetail: state.sceneConfig.eventTypeDetail.data,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(Form.create()(SceneCreate))