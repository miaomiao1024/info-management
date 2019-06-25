import React, { Component } from 'react'
import {
  PageTitle,
} from '@components'
import TitleNav from './TitleNav/'
import {
  Row,
  Col,
} from 'antd'
import { 
  bindActionCreators 
} from 'redux'
import {
  connect,
} from 'react-redux'
import { actions } from '@modules/SceneConfig'
import BasicInfo from './BasicInfo'
import { 
  fetch,
} from '@didi/fate-common'

class sceneConfigDetail extends Component {
  constructor(props){
    super(props)
    this.state={
      
    }
  }
  componentDidMount() {
    console.log("查看是否提前加载")
    const {
      match: { params: { id } },
      actions: { getSceneConfigDetail },
    } = this.props
    if (id) {
      getSceneConfigDetail({ id: id })
    }
  }

  render(){
    const { sceneConfigDetail } = this.props
    const arrDetial = []
    arrDetial.push(sceneConfigDetail)
    return (
      <div className="metric-detail-page">
        <PageTitle
          titles={['场景配置','场景配置-详情']}
        />
        <section className="basic-info-container">
          <TitleNav title="基本信息" />
          <Row>
            <Col span={20}>
              {arrDetial[0] && <BasicInfo data={arrDetial[0]}/>}
            </Col>
          </Row>
        </section>

      </div>
    )
  }
}
export default connect(
  state => ({
    sceneConfigDetail: state.sceneConfig.sceneConfigDetail.data,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(sceneConfigDetail)  