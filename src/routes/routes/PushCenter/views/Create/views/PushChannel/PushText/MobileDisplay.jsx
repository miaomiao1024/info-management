import React, {
  Component,
} from 'react'
import {
  Row,
  Col,
  Icon,
  Card,
} from 'antd'
/* import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '@modules/PushCenter' */
import './index.styl'


class MobileDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  render() {
    const{
      text:{
        imConfig:{
          imTitle,
          imageUrl,
          imContent,
          action,
        }
      },
      mobileTitle
    } = this.props 
    return (
      <div className='mobile-display'>
        <div className='mobile-context'>
          <Row style={{fontSize:'10px',color:'gray'}}>
            <Col span={8} style={{textAlign:'left'}}>中国移动</Col>
            <Col span={8} style={{textAlign:'center'}}>11:24</Col> 
            <Col span={8} style={{textAlign:'right'}}><Icon type="wifi" /></Col> 
          </Row>
          <Row>
            <Col span={1} style={{textAlign:'left'}}><Icon type="left" /></Col>
            <Col span={22} style={{textAlign:'center'}}>{mobileTitle}</Col>
          </Row>
          <div className='mobile-main'>
            <Card bodyStyle={{ padding: 0 ,borderRadius:'5px'}}>
              <div className="custom-image" style={{padding:'0'}}>
                {imageUrl &&
                  <img alt="example" width="100%" src={imageUrl} />
                } 
              </div>
              <div className="custom-card">
                <h4>{imTitle}</h4>
                <p>{imContent}</p>
                {action &&
                  <div>
                    <div className='link-top'></div>
                    <a   
                      target="view_window" 
                      href={action} 
                      style={{fontSize:'10px',marginTop:'10px'}}
                    >查看详情<Icon type="right" />
                    </a>
                  </div>
                }
              </div>
            </Card>
          </div>
        </div>
        <div className='mobile-home'></div>
      </div>
    )
  }
}
/* export default connect(
  state => ({taskListParams: state.pushCenter.taskListParams,}),
  dispatch => ({ actions : bindActionCreators(actions,dispatch)})
)(MobileDisplay) */
export default MobileDisplay