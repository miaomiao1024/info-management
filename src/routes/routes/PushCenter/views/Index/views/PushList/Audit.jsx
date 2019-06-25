import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Form,
  Modal,
  Radio,
  Input,
  message,
  Button,
} from 'antd'
import { fetch } from '@didi/fate-common'
import { actions } from '@modules/PushCenter'

class Audit extends Component {
  static defaultProps = {
    activityId: '',
    source: '',
  }
  static propTypes = {
    form: T.object.isRequired,
    isShowAuditModal: T.bool.isRequired,
    actions: T.object.isRequired,
    auditParams: T.object.isRequired,
    seartchParams: T.object.isRequired,
    activityId: T.string,
    source: T.string,
  }
  constructor(props) {
    super(props)
    this.state = {
      isPass: '1',
    }
  }
  onSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // const props = this.props
    const auditParams = this.props.auditParams
    const values = this.props.form.getFieldsValue()
    if (!values.isPass) {
      message.error('请选择是否通过')
      return
    }
    if (values.isPass === '2' && (!values.rejectReason)) {
      message.error('请填写拒绝原因')
      return
    }
    values.activityId = auditParams.activityId
    values.taskId = auditParams.info.taskId
    values.bizLine = auditParams.bizLineId
    values.pushChannel = auditParams.info.pushChannelId
    values.status = auditParams.info.statusId

    fetch('/api/push/task/audit', {
      method: 'POST',
      data: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        message.success('操作成功')
        if (this.props.source && this.props.source === 'detail') {
          const { fetchPushToolDetail } = this.props.actions
          fetchPushToolDetail({ activityId: this.props.activityId })
        } else {
          const { fetchPushToolActivityList } = this.props.actions
          fetchPushToolActivityList(this.props.seartchParams)
        }
      } else if (res && res.status !== 10000) {
        message.success(res.msg)
      }
    })
    this.hideModal()
  }
  hideModal = () => {
    const { actions: { setAuditModal }, form: { resetFields } } = this.props
    resetFields()
    setAuditModal(false)
  }
  handleOk = () => {
    this.hideModal()
  }
  handleCancel = () => {
    this.hideModal()
  }
  render() {
    const { form, isShowAuditModal } = this.props
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    return (
      <Modal
        title="审核"
        visible={isShowAuditModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[]}
      >
        <Form onSubmit={this.onSubmit}>
          <Form.Item label="是否审核通过" {...formItemLayout}>
            {getFieldDecorator('isPass', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="2">否</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {getFieldValue("isPass") === '2'
            && <Form.Item label="拒绝原因" {...formItemLayout}>
              {getFieldDecorator('rejectReason')(
                <Input.TextArea />,
              )}
            </Form.Item>
          }
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '1em' }}>确认</Button>
            <Button onClick={this.handleCancel}>取消</Button>
          </div>
        </Form>
      </Modal>
    )
  }
}
export default connect(state => ({
  isShowAuditModal: state.pushCenter.isShowAuditModal,
  auditParams: state.pushCenter.auditParams,
  seartchParams: state.pushCenter.seartchParams,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(Audit))

