import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Form,
  Modal,
  Row,
  Col,
  message,
} from 'antd'
import LabelTextarea from '../../../LabelTextarea'
import SelectDocTag from './SelectDocTag'
import { actions } from '@modules/PushCenter'

class SelectDocModal extends Component {
  static propTypes = {
    docModal: T.object.isRequired,
    actions: T.object.isRequired,
    form: T.object.isRequired,
    templateTag: T.array.isRequired,
    taskListParams: T.array.isRequired,
    preTemplateTag: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      tagDetail: '',
      // selectedRows: [],
      pushText: props.docModal.pushText || '',
    }
  }
  componentWillReceiveProps(nextProps) {
    // const { pushText: pushTextState } = this.state
    const {
      docModal: {
        pushText: prePushText,
      },
    } = this.props
    const {
      docModal: {
        pushText,
      },
    } = nextProps
    if (pushText !== prePushText) {
      this.setState({ pushText })
    }
    // const {
    //   docModal: {
    //     pushChannel,
    //   },
    //   // taskListParams,
    // } = nextProps
    // const { taskListParams: preTaskListParams } = this.props
    // const { pushText } = taskListParams.find((item) => {
    //   if (!item) return false
    //   return item.pushChannel === pushChannel
    // })
    // const { pushText: prePushText } = preTaskListParams.find((item) => {
    //   if (!item) return false
    //   return item.pushChannel === pushChannel
    // })
    // if (prePushText !== pushText) {
    //   this.setState({ pushText })
    // }
    // if (this.state.pushText === '' && pushText !== '') {
    //   this.setState({ pushText })
    // }
  }
  handleTextChange = (value) => {
    const { templateTag, actions: { setTemplateTag } } = this.props
    this.setState({ pushText: value })
    let templateTagTem = Array.from(templateTag)
    templateTagTem = templateTagTem.map((item) => {
      const reg = new RegExp(`{${item.labelName}}`, 'ig')
      const matchs = value.match(reg) || []
      return { ...item, checkedCount: matchs.length }
    })
    setTemplateTag(templateTagTem)
    // setDocModal({ pushText: value })
  }
  handleTemplateTagCallback =(templateTag) => {
    const { actions: { setTemplateTag } } = this.props
    setTemplateTag(templateTag)
  }

  pushTextJudge = (e) => {
    if (e.target.value && e.target.value.length > 240) {
      message.error('PUSH文案不超过240个汉字')
      // const pushText = document.getElementById('pushText')
      // pushText.focus()
      // input.setSelectionRange(0, input.value.length)
    }
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
  }
  hideModal = () => {
    const {
      actions: {
        setDocModal,
      },
    } = this.props
    setDocModal({ visiable: false })
  }
  handleOk = () => {
    const {
      actions: {
        setDocModal,
      },
    } = this.props
    // const { setSelectedTag } = this.props.actions
    // setSelectedTag(this.state.selectedRows)
    this.hideModal()
    const { pushText } = this.state
    setDocModal({ pushText })
  }
  handleCancel = () => {
    this.hideModal()
    const {
      docModal: {
        pushChannel,
      },
      actions: { setTemplateTag },
      taskListParams,
      preTemplateTag,
    } = this.props
    const { pushText } = taskListParams.find((item) => {
      if (!item) return false
      return item.pushChannel === pushChannel
    })
    this.setState({ pushText }, () => {
      setTemplateTag(preTemplateTag)
    })
  }
  render() {
    const {
      docModal: {
        visiable,
      },
      templateTag,
    } = this.props
    console.log(visiable)
    return (
      <Modal
        title="使用标签创建文案"
        visible={visiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="pushtool-doc-modal"
      >
        <Form
          onSubmit={this.handleSubmit}
          onReset={this.handleReset}
          style={{ border: '1px solid #e9e9e9' }}
        >
          <Row>
            <Col>
              <LabelTextarea
                onChange={this.handleTextChange}
                value={this.state.pushText}
                templateTag={templateTag}
                onBlur={this.pushTextJudge}
                templateTagCallback={this.handleTemplateTagCallback}
                placeholder="请输入PUSH文案，不超过240个汉字"
              />
            </Col>
          </Row>
        </Form>
        <div className="push-tool-doc-tag" >
          <SelectDocTag />
        </div>
      </Modal>
    )
  }
}
export default connect(state => ({
  docModal: state.pushCenter.docModal,
  pushText: state.pushCenter.pushText,
  templateTag: state.pushCenter.templateTag,
  taskListParams: state.pushCenter.taskListParams,
  preTemplateTag: state.pushCenter.preTemplateTag,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectDocModal))
