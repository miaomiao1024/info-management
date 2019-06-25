import React, { Component } from 'react'
import T from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SelectTag from './SelectTag'
//import SelectDocModal from './SelectDocTag/SelectDocModal'
import PushChannel from './PushChannel/index'
import { actions } from '@modules/PushCenter'
import './index.styl'
import {
  PUSH_TOOL_RULE,
} from '../../../configs'
import {
  PageTitle,
  Tabs,
} from '@components'

class PushCreate extends Component {
  static propTypes = {
    history: T.object.isRequired,
    // pushRule: T.string.isRequired,
    activatedTab: T.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }
  tabChange = (activatedTab) => {
    const { actions : { setActivatedTab }} = this.props
    setActivatedTab(activatedTab.activeKey)
  }
  selectedTagChange= (selectedTag) => {
    const { actions : { setSelectedTag } } = this.props
    setSelectedTag(selectedTag)
  }
  render() {
    const { activatedTab ,history} = this.props
    console.log(history)
    return (
      <div className="push-tool-page">
        <PageTitle titles={['推送中心', '新建PUSH']} />
        <Tabs
          data={PUSH_TOOL_RULE}
          onChange={this.tabChange}
        />
        {activatedTab === '1' &&
          <SelectTag onChange={this.selectedTagChange} />
        }
        <PushChannel 
          history={this.props.history} 
          onRef={this.onRef}
        />
        
      </div>
    )
  }
}

export default connect(state => ({
  // pushRule: state.pushCenter.pushRule,
  activatedTab: state.pushCenter.activatedTab,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(PushCreate)
