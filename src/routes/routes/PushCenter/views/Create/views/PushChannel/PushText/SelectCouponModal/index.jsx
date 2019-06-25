import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cookie from 'js-cookie'
import {
  Form,
  Modal,
  Row,
  Col,
  Button,
  Radio,
  Input,
  Table,
  message,
  Select,
} from 'antd'
import {
  Link,
} from 'react-router-dom'
import {
  datef,
  sso,
} from '@didi/fate-common'
import { actions } from '@modules/PushCenter'
import './index.styl'
import {
  BUSINESSES,
} from '../../../../../../configs'

const FIRST_PAGE = 1
const PAGE_SIZE = 4

const { formatDate } = datef
const { toLogin } = sso
let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

class SelectCouponModal extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isShowCouponModal: T.bool.isRequired,
    form: T.object.isRequired,
    couponList: T.object.isRequired,
    couponSelectType: T.string.isRequired,
    onChange: T.func.isRequired,
    selectedCoupon: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      current: FIRST_PAGE,
      selectedRows: [],
      selectedRowPageKeys: {},
    }
  }
  componentDidMount() {
    const { setSelectedCoupon, setCouponListParams } = this.props.actions
    setSelectedCoupon([])
    setCouponListParams(this.getCouponListParams(FIRST_PAGE))
  }
  componentWillReceiveProps(nextProps) {
    const { selectedCoupon } = nextProps
    if (selectedCoupon.length === 0) {
      this.setState({ selectedRows: [], selectedRowPageKeys: {} })
    }
  }
  getCouponListParams = (index) => {
    const {
      form,
    } = this.props
    const {
      getFieldValue,
    } = form
    const statusOptions = ['3'] // 只选生效中, 待生效的
    //   const section = getFieldValue('section') || []
    let operatorName = ""
    if (user) {
      operatorName = user.admin || user.roleList.indexOf('admin') !== -1 ? null : user.userName
    }
    return {
      pageIndex: index,
      pageSize: PAGE_SIZE,
      // section: section[0],
      // subSection: section[1],
      bizLine: getFieldValue('bizLine'),
      status: statusOptions.join(','),
      activityName: getFieldValue('activityName'),
      couponId: getFieldValue('couponId'),
      operator: operatorName,
    }
  }
  handleOk = () => {
    if (this.state.selectedRows.length > 3) {
      message.error('每次最多可投放3个批次的券')
      return
    }
    const { setSelectedCoupon } = this.props.actions
    setSelectedCoupon(this.state.selectedRows)
    console.log(this.state.selectedRows)
    const { onChange } = this.props
    const couponIds = this.state.selectedRows.map(coupon => coupon.couponId)
    onChange({ couponIds })
    this.hideModal()
  }

  hideModal = () => {
    const { setCouponModal } = this.props.actions
    setCouponModal(false)
    this.setState({ selectedRows: [], selectedRowPageKeys: {}, current: FIRST_PAGE })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const params = this.getCouponListParams(FIRST_PAGE)
    const { fetchPushToolCouponList } = this.props.actions
    fetchPushToolCouponList(params)
    this.setState({ selectedRows: [], selectedRowPageKeys: {} })
  }
  handleReset = (e) => {
    e.preventDefault()
    const {
      form,
    } = this.props
    form.resetFields()
  }
  handlePageChagne = (page) => {
    const params = this.getCouponListParams(page)
    const { fetchPushToolCouponList } = this.props.actions
    fetchPushToolCouponList(params)
    this.setState({ current: page })
  }
  handleSelectRow = (selectedRowKeys) => {
    if (this.state.selectedRows.length < 3) {
      const current = this.state.current
      const data = Object.assign({}, this.state.selectedRowPageKeys, { [current]: selectedRowKeys })
      this.setState({ selectedRowPageKeys: data })
    }
  }
  handleSelect = (record, selected) => {
    const oriRows = this.state.selectedRows
    if (selected) {
      if (this.state.selectedRows.length >= 3) {
        message.error('每次最多可投放3个批次的券')
      } else {
        oriRows.push(record)
        this.setState({ selectedRows: oriRows })
        console.log(this.state.selectedRows)
      }
    } else {
      const resultRows = oriRows.filter(row => (row.couponId !== record.couponId))
      this.setState({ selectedRows: resultRows })
    }
  }
  render() {
    const { isShowCouponModal, form, couponList } = this.props
    const data = couponList.coupons
    const current = this.state.current
    // const current = couponList.pageIndex
    const total = couponList.itemCount
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const colSpan = {
      span: 12,
    }
    const columns = [{
      title: '优惠券ID',
      dataIndex: 'couponId',
    }, {
      title: '业务线',
      key: 'bizLine',
      width: '7em',
      render: (text, record) => record.bizLine && record.bizLine.name,
    }, {
      title: '券活动名称',
      dataIndex: 'activityName',
    }, {
      title: '券面额',
      key: 'discount',
      width: '6em',
      render: (text, record) => record.discount / 100,
    }, {
      title: '券余额',
      key: 'budgetBalance',
      width: '6em',
      render: (text, record) => record.budgetBalance / 100,
    }, {
      title: '活动起止时间',
      key: 'time',
      width: '13em',
      render: (text, record) => [
        <p style={{ lineHeight: 1.4 }}>{formatDate(record.startTime)}</p>,
        <p style={{ lineHeight: 1.4 }}>{formatDate(record.endTime)}</p>,
      ],
    }, {
      title: '券状态',
      key: 'couponStatus',
      width: '6em',
      render: (text, record) => record.status.name,
    }, {
      title: '预算归属',
      key: 'section',
      render: (text, record) =>
        `${record.section && record.section.name}-${record.subSection && record.subSection.name}`,
    }
      // , {
      //   title: '详情',
      //   key: 'detail',
      //   width: '5em',
      //   render: (text, record) => (
      //     <Link to={`/activity/coupon/detail/${record.couponId}`}>
      //       <span>详情</span>
      //     </Link>
      //   ),
      // }
    ]
    return (
      <Modal
        title="选择优惠券"
        className="pushtool-coupon-modal"
        visible={isShowCouponModal}
        onCancel={this.hideModal}
        onOk={this.handleOk}
        width={1000}
      >
        <Form
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ border: '1px solid #e9e9e9', paddingTop: '1em', marginBottom: '1em' }}

        >
          <Row>
            <Col {...colSpan}>
              <Form.Item
                {...formItemLayout}
                label="业务线"
              >
                {getFieldDecorator('bizLine', {
                  // initialValue: bizLine,
                })(
                  <Select placeholder="请选择业务线">
                    {BUSINESSES
                      && BUSINESSES.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...colSpan}>
              <Form.Item
                {...formItemLayout}
                label="券ID"
              >
                {getFieldDecorator('couponId', {
                })(
                  <Input placeholder="" />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colSpan}>
              <Form.Item
                {...formItemLayout}
                label="券活动名称"
              >
                {getFieldDecorator('activityName', {
                })(
                  <Input placeholder="请输入券活动名称，支持模糊搜索" />,
                )}
              </Form.Item>
            </Col>
            <Col  {...colSpan} style={{ textAlign: 'right', paddingRight: '4em' }}>
              <Button style={{ marginRight: '10px', padding: '0 2em' }} htmlType="reset">清空</Button>
              <Button type="primary" onClick={this.handleSubmit} style={{ padding: '0 2em' }}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            current: Number.parseInt(current),
            total: Number.parseInt(total),
            pageSize: PAGE_SIZE,
            onChange: this.handlePageChagne,
            showTotal: () => `共 ${total} 条数据`,
          }}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowPageKeys[current] || [],
            onChange: this.handleSelectRow,
            onSelect: this.handleSelect,
            type: this.props.couponSelectType,
          }}
        />
      </Modal>
    )
  }
}

export default connect(state => ({
  isShowCouponModal: state.pushCenter.isShowCouponModal,
  couponListParams: state.pushCenter.couponListParams,
  couponList: state.pushCenter.couponList.data,
  couponSelectType: state.pushCenter.couponSelectType,
  selectedCoupon: state.pushCenter.selectedCoupon,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectCouponModal))

