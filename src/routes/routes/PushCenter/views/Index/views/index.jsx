import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Form,
} from 'antd'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import SearchModule from './SearchModule'
import PushList from './PushList'
import {
  ModuleTitle,
} from '@components'
import { actions } from '@modules/PushCenter'

class PushCenter extends Component {
  static propTypes = {
    actions: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="push-tool-page">
        <ModuleTitle title="PUSH工具列表" />
        <SearchModule />
        <PushList />
      </div>
    )
  }
}
export default connect(state => ({
  activityListData: state.pushCenter.activityListData,
  seartchParams: state.pushCenter.seartchParams,
  pageIndex: state.pushCenter.pageIndex,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushCenter))
