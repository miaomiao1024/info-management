import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Form,
  Input,
  message,
  Row,
  Col,
  // Button,
} from 'antd'
import cookie from 'js-cookie'
import { sso } from '@didi/fate-common'
import LabelTextarea from '../../../Create/views/LabelTextarea'

import { actions } from '@modules/PushCenter'

const { toLogin } = sso
let user = cookie.get('fate.sso.cookie')

if (!user) {
  toLogin()
}

if (user) {
  user = JSON.parse(user)
}

class EditCard extends Component {
  static propTypes = {
    pushText: T.string.isRequired,
    landingPage: T.string.isRequired,
    // taskId: T.string.isRequired,
    form: T.object.isRequired,
    pushChannelId: T.string.isRequired,
    actions: T.object.isRequired,
    docModal: T.object.isRequired,
    // templateTag: T.array.isRequired,
    pushRule: T.string.isRequired,
    data: T.object,
  }
  static defaultProps = {
    data: {},
  }
  constructor(props) {
    super(props)
    this.state = {
      ignoreGlobalFatigue: '0',
    }
  }
  componentDidMount() {
    const { actions: { fetchPushToolTemplateTag } } = this.props
    fetchPushToolTemplateTag()
  }
  componentWillReceiveProps({ docModal }) {
    const { pushChannel, pushText } = docModal
    const { form: { setFieldsValue } } = this.props
    const {
      docModal: {
        pushText: prePushText,
      },
      pushChannelId: prePushChannel,
    } = this.props
    if (pushChannel === prePushChannel && pushText !== prePushText) {
      setFieldsValue({ pushText })
      // this.triggerChange({ pushText })
    }
  }
  pushTextJudge = (e) => {
    if (e.target.value && e.target.value.length > 240) {
      message.error('PUSH文案不超过240个汉字')
      const pushText = document.getElementById('pushText')
      pushText.focus()
      // input.setSelectionRange(0, input.value.length)
    }
  }
  landingPageJudge = (e) => {
    const patt = /^https?:\/\/.+/
    if (e.target.value && !patt.test(e.target.value)) {
      message.error('请输入合法PUSH落地页链接')
      // this.refs.landingPage.focus()
      const landingPage = document.getElementById('landingPage')
      landingPage.focus()
      // input.setSelectionRange(0, input.value.length)
    }
  }
  originalLandingPageJudge = (e) => {
    const patt = /^https?:\/\/.+/
    if (e.target.value && !patt.test(e.target.value)) {
      message.error('请输入合法PUSH原始长链接')
      const originalLandingPage = document.getElementById('originalLandingPage')
      originalLandingPage.focus()
    }
  }
  handleGlobalFatigueChange = (e) => {
    this.setState({ ignoreGlobalFatigue: e.target.value })
  }
  handleTextChange=() => {}
  render() {
    const formItemLayout = {
      wrapperCol: { span: 15 },
      labelCol: { span: 5 },
    }
    const { form, pushChannelId, pushRule, data,originalLandingPage } = this.props
    // const fatigueEndTime = new Date(data.fatigueEndTime)
    // const fatigueEndTimeStr = fatigueEndTime.toLocaleString('chinese', { hour12: false })
    // const fatigueStartTime = new Date(data.fatigueStartTime)
    // const fatigueStartTimeStr = fatigueStartTime.toLocaleString('chinese', { hour12: false })
    const { getFieldDecorator, getFieldValue } = form
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="文案"
        >
          <Row>
            <Col span={19}>
              {getFieldDecorator('pushText', {
                initialValue: this.props.pushText,
              })(
                <div>
                  <LabelTextarea
                    onChange={this.handleTextChange}
                    value={getFieldValue('pushText')}
                    onBlur={this.pushTextJudge}
                    placeholder="请输入PUSH文案，不超过240个汉字"
                    disabled
                  />
                </div>
                
              )}
            </Col>
            {/* <Col
              span={4}
              style={{ marginLeft: 3 }}
            >
              <Button
                size="default"
                style={{ marginLeft: 5 }}
                onClick={
                  () => {
                    const { actions: { setDocModal, setTemplateTag }, templateTag } = this.props
                    const pushText = getFieldValue('pushText')
                    setDocModal({ visiable: true, pushChannel: pushChannelId, pushText })
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
                  }
                }
              >使用标签创建</Button>
            </Col> */}
          </Row>
        </Form.Item>
        {pushChannelId !== '4' && pushRule !== 2
        && <Form.Item
          {...formItemLayout}
          label="落地页"
        >
          {getFieldDecorator('landingPage', {
            initialValue: this.props.landingPage,
          })(
            <Input
              // defaultValue={this.props.landingPage}
              placeholder="请输入PUSH落地页链接"
              onBlur={this.landingPageJudge}
              id="landingPage"
            />,
          )}
        </Form.Item>
        }
        {originalLandingPage
        && <Form.Item
          {...formItemLayout}
          label="原始长链接"
        >
          {getFieldDecorator('originalLandingPage', {
            initialValue: this.props.originalLandingPage,
          })(
            <Input
              placeholder="请输入PUSH原始长链接"
              onBlur={this.originalLandingPageJudge}
              id="originalLandingPage"
            />,
          )}
        </Form.Item>
        }
      </Form>
    )
  }
}

export default connect(state => ({
  isShowCouponModal: state.pushCenter.isShowCouponModal,
  taskListParams: state.pushCenter.taskListParams,
  selectedCoupon: state.pushCenter.selectedCoupon,
  docModal: state.pushCenter.docModal,
  templateTag: state.pushCenter.templateTag,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(EditCard))
