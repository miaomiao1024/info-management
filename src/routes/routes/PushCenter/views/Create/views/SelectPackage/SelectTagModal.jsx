import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Form,
  Modal,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  message,
  // Tooltip,
  DatePicker,
} from 'antd'
import moment from 'moment'
import {
  Link,
} from 'react-router-dom'
import { 
  fetch,
  // datef,
  json
} from '@didi/fate-common'
import './index.styl'
import {
  CROWD_TAG_TYPE_OPTIONS,
} from '../../../../configs'

import { actions } from '@modules/PushCenter'

const { jsonToParams } = json
// const { formatDateFromMS } = datef
const FIRST_PAGE = 1
const PAGE_SIZE = 4

class SelectTagModal extends Component {
  static propTypes = {
    isShowTagModal: T.bool.isRequired,
    actions: T.object.isRequired,
    form: T.object.isRequired,
    isXiaojuPushChecked: T.bool.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      total: 0,
      tagDetail: '',
      selectedRows: [],
      selectedRowKeys: [],  // 用一个长度为2的数组[a,b]进行定位 a=>pageIndex, b=>index
    }
  }
  componentWillMount() {
    this.getGroupList(FIRST_PAGE)
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
    const {
      size,
    } = this.state
    fetch(`/api/user-tag/query?${jsonToParams({
      ...values,
      pageIndex: page,
      pageSize: size,
    })}`).then((res) => {
      if (res && res.status === 10000) {
        this.setState({
          data: res.data.items,
          current: page,
          total: res.data.itemCount,
        })
        // clearTimeout(this.getGroupListTimer)
        // const hasWaitingGroup =
        // res.data.items.some(cur => cur.status && cur.status.id === USER_GROUP_STATUS_WAITING)
        // if (hasWaitingGroup) {
        //   this.getGroupListTimer = setTimeout(() => {
        //     this.getGroupList(page)
        //   }, 2000)
        // }
      }
    })
  }
  getTagDetail = (e, id) => {
    e.preventDefault()
    fetch(`/api/user-tag/detail?userTagId=${id}`)
      .then((res) => {
        if (res && res.status === 10000) {
          this.setState({ tagDetail: res.data.ruleInfo })
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
    this.getGroupList(FIRST_PAGE)
    this.setState({ selectedRows: [], selectedRowKeys: [],})
  }
  hideModal = () => {
    const { actions: { setTagModal } } = this.props
    setTagModal(false)
    this.setState({selectedRowKeys: [], selectedRows: []})
  }
  handleOk = () => {
    const { setSelectedTag } = this.props.actions
    if (this.state.selectedRows.length > 0) {
      // const { actualAmount } = this.state.selectedRows[0]
      // if (actualAmount > 5000000) {
      //   message.error('人群包用户数不能超出五百万')
      // } else {
      //   setSelectedTag(this.state.selectedRows)
      //   this.hideModal()
      // }
      setSelectedTag(this.state.selectedRows)
      this.hideModal()
    }
  }
  handleCancel = () => {
    this.hideModal()
  }
  handleSelectRow = (selectedRowKeys, selectedRows) => {
    const { isXiaojuPushChecked } = this.props
    if (isXiaojuPushChecked && selectedRows[0].idType.id !== '3') {
      message.error("该人群包不适用于小桔车服端外PUSH通道")
      return
    }
    const keyLocation = [this.state.current, [selectedRowKeys[0]]]
    this.setState({ selectedRowKeys: keyLocation })
    this.setState({ selectedRows })
  }
  handlePageChagne = (page) => {
    this.getGroupList(page)
  }
  judgeID = (e) => {
    const value = e.target.value
    if (value && !/^\d*$/.test(value)) {
      message.error('请输入出数字活动id')
      const { setFieldsValue } = this.props.form
      setFieldsValue({ userTagId: '' })
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
      isShowTagModal,
      form,
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
      width: '7em',
    }, {
      title: '用户数',
      dataIndex: 'actualUserCount',
      render: (text, record) => `${record.type.id && record.type.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
      width: '7em',
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: (text, record) => `${record.creatorNameZh || ''}`,
      width: '6em',
    }, {
      title: '创建/更新时间',
      key: 'createTime',
      render: (text, record) => `${record.createTime}`,
      // render: (text, record) => `${formatDateFromMS(Number(record.createTime))}`,
    }, {
      title: '最近使用时间',
      key: 'operateTime',
      render: (text, record) => `${record.operateTime}`,

      // render: (text, record) => `${formatDateFromMS(Number(record.operateTime))}`,
    }, {
      title: '人群包状态',
      key: 'status',
      render: (text, record) => `${(record.status && record.status.name) || '--'}`,
      width: '6em',
    }, {
      title: '详情',
      key: 'detail',
      // render: (text, record) => `${record.tagId}`,

      render: (text, record) => (
        <Link to={`/customer/tag/detail/${record.tagId}`}>
          <span>详情</span>
        </Link>
      ),
      width: '5em',
    }]
    return (
      <Modal
        title="选择人群包"
        visible={isShowTagModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="pushtool-tag-modal"
      >
        <Form
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ border: '1px solid #e9e9e9', paddingTop: '1em', marginBottom: '1em' }}
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
            total,
            pageSize: size,
            onChange: this.handlePageChagne,
            showTotal: () => `共 ${total} 条数据`,
          }}
          rowSelection={{
            type: 'radio',
            onChange: this.handleSelectRow,
            selectedRowKeys: selectedRowKeys[0] && selectedRowKeys[0] === current ? selectedRowKeys[1] : [],
          }}
        />
      </Modal>
    )
  }
}
export default connect(state => ({
  isShowTagModal: state.pushCenter.isShowTagModal,
  isXiaojuPushChecked: state.pushCenter.isXiaojuPushChecked,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectTagModal))

