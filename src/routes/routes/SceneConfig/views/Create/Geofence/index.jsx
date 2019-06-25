import React, { Component } from 'react'
import {
  Form,
  Radio,
  Row,
  Col,
} from 'antd'
import SpecificAreaMap from './SpecificAreaMap'
import CustomAreaMap from './CustomAreaMap'
import SpecificBusiness from './SpecificBusiness'
import { 
  SCENE_CONFIG_SCENE_RANGE,
  SCENE_CONFIG_SCENE_RANGE_SPECIFIC_AREA,
} from '../../../configs'

class Geofence extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      sceneRange:'1',
    }
  }
  changeSceneRangeRadio = async ({target}) => {
    this.setState({sceneRange:target.value})
  }
   
  render() {
    const createFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    const { form } = this.props
    const { getFieldDecorator,} = form
    const { sceneRange } = this.state
    return (
      <div className="geofence_page">
        <Form
          onSubmit={this.handleSubmit}
        >
          <Form.Item
            {...formItemLayout}
            label="用户类型"
          >
            {getFieldDecorator('userType', {
              rules: [{
                required: true,
                message: '必选',
              }],
              initialValue: SCENE_CONFIG_SCENE_RANGE_SPECIFIC_AREA,
            })(
              <Radio.Group
                value={sceneRange}
                onChange={(value) => this.changeSceneRangeRadio(value)}
              >
                {
                  SCENE_CONFIG_SCENE_RANGE.map(cur => (
                    <Radio key={cur.id} value={cur.id}>{cur.name}</Radio>
                  ))
                }
              </Radio.Group>,
            )}
          </Form.Item>
          <Row>
            <Col offset={4} span={16}>
              {sceneRange === '1' &&
                <SpecificAreaMap />
              }
              {sceneRange === '2' && 
                <CustomAreaMap />
              }
              {sceneRange === '3' &&
                <SpecificBusiness />
              }
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

}
export default Form.create()(Geofence)
