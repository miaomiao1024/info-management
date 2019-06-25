import React, { Component } from "react"
import T from 'prop-types'
import {
  Modal,
  Table,
  Form,
  Row,
  Col,
  Input,
  Button,
} from "antd"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '@modules/PushCenter'

const FIRST_PAGE = 1
const PAGE_SIZE = 10
class SelectLabelModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagDetail: '',
      selectedRows: [],
      selectedRowKeys: [],  // 用一个长度为2的数组[a,b]进行定位 a=>pageIndex, b=>index
    }
  }
  componentDidMount() {
    const values = {
      pageNo: FIRST_PAGE,
      pageSize: PAGE_SIZE,
    }
    const { actions: { fetchPushGroupQueryList } } = this.props
    fetchPushGroupQueryList(values)
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.visible && nextProps.deleteHidden){
      this.setState({selectedRowKeys:[]})
    }
  }
  handleOk = (selectedRows) => {
    const { onChange, hideModal } = this.props
    if (selectedRows.length > 0) {
      onChange(selectedRows)
      hideModal()
      const { actions:{fetchPushToolEquityList,saveEquityData} } = this.props
      fetchPushToolEquityList({marketingActivityId:selectedRows[0].groupId})
      saveEquityData(selectedRows)
    }
  }

  handleSelectRow = (selectedRowKeys, selectedRows) => {
    const { pageCurrent: current } = this.props
    const keyLocation = [current, [selectedRowKeys[0]]]
    this.setState({ selectedRowKeys: keyLocation })
    this.setState({ selectedRows })
    this.handleOk(selectedRows)
  }
  handlePageChagne = (page) => {
    const {groupSeartchParams} = this.props
    groupSeartchParams.pageNo = page
    groupSeartchParams.pageSize = PAGE_SIZE
    const { fetchPushGroupQueryList, setGroupCurrentPageIndex } = this.props.actions
    fetchPushGroupQueryList(this.props.groupSeartchParams)
    setGroupCurrentPageIndex(page)
  }
  handleCancel = (e) => {
    e.preventDefault()
    const { hideModal } = this.props
    hideModal()
  }
  handleReset = (e) => {
    e.preventDefault()
    const {
      form,
    } = this.props
    form.resetFields()
  }
  handleSubmit = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const {
      form,
      actions: { fetchPushGroupQueryList, setGroupCurrentPageIndex } } = this.props
    const values = form.getFieldsValue()
    values.pageIndex = FIRST_PAGE
    values.pageSize = PAGE_SIZE
    //存放搜索参数--供分页操作时使用
    values.groupId = values.groupId
    const { setGroupQuerySearchParams } = this.props.actions
    setGroupQuerySearchParams(values)
    fetchPushGroupQueryList(values)
    setGroupCurrentPageIndex(1)
  }
  render() {
    const {
      size,
      selectedRowKeys,
    } = this.state
    const {
      visible,
      groupListData: {
        data: {
          total,
          groups,
        }
      },
      pageCurrent: current,
    } = this.props
    const formItemLayout = {
      labelCol: { span: 7 },
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
    const columns = [{
      title: '运营活动ID',
      dataIndex: 'groupId',
      render: (text, record) => (record.groupId && record.groupId) || '--',
    }, {
      title: '运营活动名称',
      dataIndex: 'groupName',
      render: (text, record) => (record.groupName && record.groupName) || '--',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text, record) => (record.startTime && record.startTime) || '--',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text, record) => (record.endTime && record.endTime) || '--',
    }, {
      title: '创建人',
      dataIndex: 'operatorZh',
      render: (text, record) => (record.operatorZh && record.operatorZh) || '--',
    }]
    return (
      <Modal
        title="选择运营活动"
        visible={visible}
        width="1000px"
        okButtonProps={{ disabled: true }}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ border: '1px solid #e9e9e9', padding: '1em', marginBottom: '3em', borderRadius: '5px' }}
        >
          <Row>
            <Col {...colSpan}>
              <Form.Item label="运营活动ID" {...formItemLayout}>
                {getFieldDecorator('groupId')(
                  <Input placeholder="请输入运营活动ID" onBlur={this.judgeID} />,
                )}
              </Form.Item>
            </Col>
            <Col {...colSpan}>
              <Form.Item label="运营活动名称" {...formItemLayout}>
                {getFieldDecorator('groupName')(
                  <Input placeholder="请输入运营活动名称" />,
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
          dataSource={groups}
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
          rowKey="id"
        />
      </Modal>
    )
  }
}
export default connect(state => ({
  groupListData: state.pushCenter.groupListData,
  pageCurrent: state.pushCenter.pageCurrent,
  groupSeartchParams: state.pushCenter.groupSeartchParams,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectLabelModal))
//export default SelectLabelModal