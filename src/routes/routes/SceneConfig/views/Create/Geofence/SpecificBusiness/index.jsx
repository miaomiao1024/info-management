import React, { Component } from 'react'
import {
  Input,
  Row,
  Col,
  Button,
} from 'antd'


class SpecificBusiness extends Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
 
  
  render() {
    
    return (
      <div className="specific_business_page">
        <Row>
          <Col span={6}>
            <Button>上传商户</Button>
          </Col>
          <Col span={6}>
            以下油站<Input />公里范围内
          </Col>
        </Row>
      </div>
    )
  }

}
export default SpecificBusiness
