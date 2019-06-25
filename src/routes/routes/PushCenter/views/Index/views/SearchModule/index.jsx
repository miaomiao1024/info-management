import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Select,
  message,
} from 'antd'
import moment from 'moment'
import {
  Module,
} from '@components'
import { actions } from '@modules/PushCenter'
import './index.styl'
import {
  PUSH_CENTER_STATUS_OPTIONS,
  PUSH_TOOL_BUSINESSES,
  PUSH_CHANNEL_OPTIONS,
  // DATE_FORMAT,
  PUSH_PERIOD_TYPE_OPTIONS,
} from '../../../../configs'

const FIRST_PAGE = 1
const PAGE_SIZE = 10

class SearchModule extends Component {
  static propTypes = {
    form: T.object.isRequired,
    actions: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentWillMount() {
    const values = {}
    values.pageIndex = FIRST_PAGE
    values.pageSize = PAGE_SIZE
    const { setPushToolSearchParams } = this.props.actions
    setPushToolSearchParams(values)
  }
  onSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      actions: { fetchPushToolActivityList, setCurrentPageIndex } } = this.props
    const values = form.getFieldsValue()
    if (values.activityId && values.activityId.length > 20) {
      message.error('推动活动ID长度<20')
    }
    if (values.createTime && values.createTime.length === 2) {
      if (values.createTime[0]) {
        values.startTime = values.createTime[0] && `${values.createTime[0].toDate().getTime()}`.substr(0, 10)
      }
      if (values.createTime[1]) {
        values.endTime = values.createTime[1] && `${values.createTime[1].toDate().getTime()}`.substr(0, 10)
      }
      if (!values.startTime && values.endTime) {
        message.error('没有输入开始时间')
        return
      }
      if (values.startTime && !values.endTime) {
        message.error('没有输入结束时间')
        return
      }
      if (values.startTime) {
        const startTimeStr = `${moment(values.startTime * 1000).format('l')} 00:00:00`
        values.startTime = new Date(startTimeStr).getTime()
      }
      if (values.endTime) {
        const sendTimeStr = `${moment((window.Number.parseInt(values.endTime) + 86400) * 1000).format('l')} 00:00:00`
        values.endTime = new Date(sendTimeStr).getTime()
      }
    }
    values.pageIndex = FIRST_PAGE
    values.pageSize = PAGE_SIZE
    const { setPushToolSearchParams } = this.props.actions
    setPushToolSearchParams(values)
    fetchPushToolActivityList(values)
    setCurrentPageIndex(1)
  }
  onReset = (e) => {
    e.preventDefault()
    const {
      form,
    } = this.props
    form.resetFields()
  }
  judgeID = (e) => {
    const value = e.target.value
    if (value && !/^\d*$/.test(value)) {
      message.error('请输入出数字活动id')
      const { setFieldsValue } = this.props.form
      setFieldsValue({ activityId: '' })
    }
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const colSpan = {
      span: 8,
    }
    const {
      form,
    } = this.props
    const {
      getFieldDecorator,
    } = form
    return (
      <div className="push_center_search_module">
        <Module color="blue" style={{ marginTop: 20 }}>
          <Form onSubmit={this.onSubmit}>
            <Row>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="推动活动ID">
                  {getFieldDecorator('activityId')(
                    <Input
                      placeholder="请输入推动活动ID"
                      onBlur={this.judgeID}
                    // id="activityID
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="活动名称">
                  {getFieldDecorator('activityName')(
                    <Input
                      placeholder="请输入推送活动名称，支持模糊查询"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="创建人">
                  {getFieldDecorator('operatorName')(
                    <Input placeholder="请输入创建人姓名" />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="业务线">
                  {getFieldDecorator('bizLine')(
                    <Select placeholder="请选择业务线" allowClear>
                      {
                        PUSH_TOOL_BUSINESSES
                      && PUSH_TOOL_BUSINESSES.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                      ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="推送通道">
                  {getFieldDecorator('pushChannel')(
                    <Select placeholder="请选择推送通道" allowClear>
                      {
                        PUSH_CHANNEL_OPTIONS
                      && PUSH_CHANNEL_OPTIONS.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                      ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="活动状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择PUSH活动状态" allowClear>
                      {
                        PUSH_CENTER_STATUS_OPTIONS
                      && PUSH_CENTER_STATUS_OPTIONS.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                      ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="推送类型">
                  {getFieldDecorator('pushType')(
                    <Select placeholder="请选择推送类型" allowClear>
                      {
                        PUSH_PERIOD_TYPE_OPTIONS
                      && PUSH_PERIOD_TYPE_OPTIONS.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                      ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item {...formItemLayout} label="创建时间">
                  {getFieldDecorator('createTime')(
                    <DatePicker.RangePicker
                      placeholder={['开始时间', '结束时间']}
                      // format={DATE_FORMAT}
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button style={{ marginLeft: 28 }} onClick={this.onReset}>清空</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Module>
      </div>
    )
  }

}
export default connect(state => ({
  // features: state.features.features,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SearchModule))
