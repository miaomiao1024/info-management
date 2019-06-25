import React, { Component } from "react"
import T from 'prop-types'
import {
  Modal,
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  DatePicker,
  Table,
  message,
} from "antd"
import moment from 'moment'
import {
  Link,
} from 'react-router-dom'
import {
  fetch,
  json
} from '@didi/fate-common'
import {
  CROWD_TAG_TYPE_OPTIONS,
  CROWD_TAG_TYPE_OPTIONS_TWO,
} from '../../../../configs'

const { jsonToParams } = json
const FIRST_PAGE = 1
const PAGE_SIZE = 5
class SelectTagModal extends Component {
  static propTypes = {
    visible: T.bool.isRequired,
    hideModal: T.func.isRequired,
    form: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      current: FIRST_PAGE,
      total: 0,
      tagDetail: '',
      selectedRows: [],
      selectedRowKeys: [],  // 用一个长度为2的数组[a,b]进行定位 a=>pageIndex, b=>index
    }
  }
  componentDidMount() {
    this.getGroupList(FIRST_PAGE)
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.visible && nextProps.deleteHidden){
      this.setState({selectedRowKeys:[]})
    }
  }
  getGroupList = (page) => {
    const {
      form,
    } = this.props
    const values = form.getFieldsValue()
    if (values.userTagId && values.userTagId.length > 19) {
      message.error('人群标签ID长度<20')
      return
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
    fetch(`/api/user-tag/query?${jsonToParams({
      ...values,
      pageIndex: page,
      pageSize: PAGE_SIZE,
    })}`).then((res) => {
      if (res && res.status === 10000) {
        this.setState({
          data: res.data.items,
          current: page,
          total: res.data.itemCount,
        })
      }
    })
  }
  handleReset = (e) => {
    e.preventDefault()
    const {
      form,
    } = this.props
    form.resetFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.getGroupList(FIRST_PAGE)
  }
  handleSelectRow = (selectedRowKeys, selectedRows) => {
    const keyLocation = [this.state.current, [selectedRowKeys[0]]]
    this.setState({ selectedRowKeys: keyLocation })
    this.setState({ selectedRows })
    this.handleOk(selectedRows)
  }
  handlePageChagne = (page) => {
    this.getGroupList(page)
  }
  handleCancel = (e) => {
    e.preventDefault()
    const { hideModal } = this.props
    hideModal()
  }
  judgeID = (e) => {
    const value = e.target.value
    if (value && !/^\d*$/.test(value)) {
      message.error('请输入出数字活动id')
      const { setFieldsValue } = this.props.form
      setFieldsValue({ userTagId: '' })
    }
  }
  handleOk = (selectedRows) => {
    const { onChange, hideModal } = this.props
    if (selectedRows.length > 0) {
      const { actualAmount } = selectedRows[0]
      if (actualAmount > 5000000) {
        message.error('人群包用户数不能超出500万')
      } else {
        onChange(selectedRows)
        hideModal()
      }
    }
  }
  render() {
    const {
      data,
      current,
      total,
      size,
      selectedRowKeys,
    } = this.state
    const {
      visible,
      form,
      visibleType,
    } = this.props
    const {
      getFieldDecorator,
    } = form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    }
    const colSpan = {
      span: 8,
    }
    const columns = [{
      title: '标签ID',
      dataIndex: 'tagId',
      render: (text, record) => (record.tagId && record.tagId) || '--',
    }, {
      title: '标签名称',
      dataIndex: 'tagName',
      render: (text, record) => (record.tagName && record.tagName) || '--',
    }, {
      title: '标签类型',
      dataIndex: 'tagType',
      render: (text, record) => (record.type && record.type.name) || '--',
    }, {
      title: '用户数',
      dataIndex: 'actualUserCount',
      render: (text, record) => `${record.type.id && record.type.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: (text, record) => `${record.creatorNameZh || ''}`,
    }, {
      title: '创建/更新时间',
      dataIndex: 'createTime',
      render: (text, record) => `${record.createTime}`,
    }, {
      title: '最近使用时间',
      dataIndex: 'operateTime',
      render: (text, record) => `${record.operateTime}`,
    }, {
      title: '人群包状态',
      dataIndex: 'status',
      render: (text, record) => `${(record.status && record.status.name) || '--'}`,
    }, {
      title: '详情',
      dataIndex: 'detail',
      render: (text, record) => (
        <Link to={`/customer/tag/detail/${record.tagId}`} target="_blank">
          <span>详情</span>
        </Link>
      ),
    }]
    return (
      <Modal
        title="选择人群包"
        visible={visible}
        width="1000px"
        okButtonProps={{ disabled: true }}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ border: '1px solid #e9e9e9', padding: '1em', marginBottom: '3em' }}
        >
          <Row>
            <Col {...colSpan}>
              <Form.Item label="人群标签ID" {...formItemLayout}>
                {getFieldDecorator('userTagId')(
                  <Input placeholder="请输入人群包ID" onBlur={this.judgeID} />,
                )}
              </Form.Item>
            </Col>
            <Col {...colSpan}>
              <Form.Item label="人群标签名称" {...formItemLayout}>
                {getFieldDecorator('userTagName')(
                  <Input placeholder="请输入人群标签名称" />,
                )}
              </Form.Item>
            </Col>
            {visibleType === "1" ?
              <Col {...colSpan}>
                <Form.Item label="标签类型" {...formItemLayout}>
                  {getFieldDecorator('userTagType')(
                    <Select
                      placeholder="请选择标签类型"
                    >
                      {
                        CROWD_TAG_TYPE_OPTIONS.map(cur => (
                          <Select.Option value={cur.id} key={cur.id}>{cur.name}</Select.Option>
                        ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              :
              <Col {...colSpan}>
                <Form.Item label="标签类型" {...formItemLayout}>
                  {getFieldDecorator('userTagType',{
                    initialValue : "3"
                  })(
                    <Select
                      placeholder="请选择标签类型"
                    >
                      {
                        CROWD_TAG_TYPE_OPTIONS_TWO.map(cur => (
                          <Select.Option value={cur.id} key={cur.id}>{cur.name}</Select.Option>
                        ))
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            }
          </Row>
          <Row>
            <Col {...colSpan}>
              <Form.Item label="创建时间" {...formItemLayout}>
                {getFieldDecorator('createTime')(
                  <DatePicker.RangePicker placeholder={['开始时间', '结束时间']} />,
                )}
              </Form.Item>
            </Col>
            <Col {...colSpan}>
              <Form.Item label="创建人" {...formItemLayout}>
                {getFieldDecorator('creatorNameZh')(
                  <Input placeholder="请输入创建人名称" />,
                )}
              </Form.Item>
            </Col>
            <Col {...colSpan} style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" style={{ padding: '0 2em' }} >查询</Button>
              <Button style={{ marginLeft: '10px', padding: '0 2em' }} htmlType="reset">清空</Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            current,
            total: parseInt(total),
            pageSize: size,
            onChange: this.handlePageChagne,
            showTotal: () => `共 ${total} 条数据`,
          }}
          rowSelection={{
            type: 'radio',
            onChange: this.handleSelectRow,
            selectedRowKeys: selectedRowKeys[0] && selectedRowKeys[0] === current ? selectedRowKeys[1] : [],
          }}
          rowKey="tagId"
        />
      </Modal>
    )
  }
}

export default Form.create()(SelectTagModal)