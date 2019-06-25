import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import {
  Tag,
  Form,
  message,
} from 'antd'
import { actions } from '@modules/PushCenter'

const CheckableTag = Tag.CheckableTag
class SelectDocTag extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    templateTag: T.array.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      selectedTags: [],
    }
  }
  componentDidMount() {
    // const { actions: { fetchPushToolTemplateTag } } = this.props
    // fetchPushToolTemplateTag()
  }
  handleChange = (index) => {
    const { templateTag, actions: { setTemplateTag } } = this.props
    const templateTagTmp = Array.from(templateTag)
    const temObj = Object.assign({}, templateTagTmp[index])
    if (temObj.checkedCount >= 1) {
      message.error(`${temObj.labelName}标签不能超过一个！`)
      return
    }
    temObj.checkedCount += 1
    templateTagTmp[index] = temObj
    setTemplateTag(templateTagTmp)
    // if (checked) {
    //   // const pushInput = document.getElementById('pushText')
    //   insertAtCursor(this.refs.pushInput, templateTagTmp[index][1].tagZh)
    // }
  }
  render() {
    // const {
    //   selectedTags,
    // } = this.state
    const { templateTag } = this.props
    return (
      <div className="pushtool-doc-tag-choose">
        <span style={{ color: 'red' }}>* 点击标签可添加到文案中</span>
        <div>
          {templateTag.map((tag, index) => (
            <CheckableTag
              style={{ border: '1px solid #d9d9d9', margin: '5px' }}
              key={tag.fieldName}
              checked={!!tag.checkedCount}
              onChange={() => this.handleChange(index)}
            >
              {tag.labelName}
            </CheckableTag>
          ))}
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  isShowTagModal: state.pushCenter.isShowTagModal,
  templateTag: state.pushCenter.templateTag,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectDocTag))
