import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cookie from 'js-cookie'
import {
  Form,
  Modal,
  Table,
} from 'antd'
import {
  sso,
} from '@didi/fate-common'
import { actions } from '@modules/PushCenter'
import './index.styl'

const { toLogin } = sso
let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

class SelectEquityModal extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isShowCouponModal: T.bool.isRequired,
    form: T.object.isRequired,
    onChange: T.func.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      selectedRowPageKeys: {},
      keyLocation:[],
    }
  }
  
  handleSelectRow = (selectedRowKeys,selectedRows) => {
    const keyLocation = [selectedRowKeys[0]]
    this.setState({ keyLocation })
    this.handleOk(selectedRows)
  }
  handleOk = (selectedRows) => {
    const { actions:{saveSelectRow},onChange } = this.props
    saveSelectRow(selectedRows)
    const couponIds = selectedRows.map(coupon => coupon.id)
    onChange({couponIds})
    this.hideModal()
  }

  hideModal = () => {
    const { actions: { setEquityModal } } = this.props
    setEquityModal(false)
  }
  
  render() {
    const { isShowEquityModal ,equityListData, selectedEquity} = this.props
    const { keyLocation } = this.state
    const columns = [{
      title: '权益ID',
      dataIndex: 'id',
      render: (text, record) => (record.id && record.id) || '--',
    }, {
      title: '权益名称',
      dataIndex: 'prizeName',
      render: (text, record) => (record.prizeName && record.prizeName) || '--',
    }, {
      title: '权益描述',
      dataIndex: 'prizeDesc',
      render: (text, record) => (record.prizeDesc && record.prizeDesc) || '--',
    }]
    return (
      <Modal
        title="选择权益"
        className="pushtool-coupon-modal"
        visible={isShowEquityModal}
        onCancel={this.hideModal}
        onOk={this.handleOk}
        okButtonProps={{ disabled: true }}
        width={1000}
      >
        <Table
          columns={columns}
          dataSource={equityListData}
          bordered
          pagination={false}
          rowSelection={{
            type: 'radio',
            onChange: this.handleSelectRow,
            selectedRowKeys: selectedEquity[0] ? keyLocation[0] : [],
          }}
          rowKey="id"
        />
      </Modal>
    )
  }
}

export default connect(state => ({
  isShowEquityModal: state.pushCenter.isShowEquityModal,
  equityListData:state.pushCenter.equityListData.data,
  selectedEquity:state.pushCenter.selectedEquity,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectEquityModal))

