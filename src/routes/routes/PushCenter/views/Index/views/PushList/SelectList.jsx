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
import { actions } from '@modules/Experiment'

class SelectList extends Component {
  static defaultProps = {
   
  }
  static propTypes = {
    
  }
  constructor(props) {
    super(props)
    this.state = {
      isPass: '1',
    }
  }
  handleSelectPush = (item,index) => {
    if(item.taskList[0].statusName != "生效中" && item.taskList[0].statusName != "待生效"){
      message.warn('仅支持状态为“生效中”“待生效”的push活动')
      return
    }
    if(item.taskList[0].pushChannelName == "优惠券"){
      message.warn('不能选择推送通道为"优惠劵"的push活动')
      return
    }
    const { actions : { checkedSelectedPush , setModalState} } = this.props
    item.checkedIndex = index 
    checkedSelectedPush(item)
    setModalState(false)
    const {activityStrategys} = this.props
    const experimentParams = {
      experimentParams:item
    }
    activityStrategys[index] = Object.assign({}, activityStrategys[index], experimentParams)
    const {actions:{addActivityStrategy}} =this.props
    addActivityStrategy(activityStrategys)
  }
  render() {
    const { item, checkedIndex} = this.props
    return (
      <Button type="primary" onClick={()=>{this.handleSelectPush(item,checkedIndex)}}>选中</Button>
    )
  }
}
export default connect(state => ({
  pageIndex: state.pushCenter.pageIndex,
  checkedIndex:state.experiment.checkedIndex,
  activityStrategys:state.experiment.activityStrategys,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(SelectList)

