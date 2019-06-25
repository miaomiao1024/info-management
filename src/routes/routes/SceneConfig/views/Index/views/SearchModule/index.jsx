import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
} from 'antd'
import { Button, Module,} from '@components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from '@modules/SceneConfig'
import {
  PUSH_TOOL_BUSINESSES,
  SCENE_CONFIG_STATUS,
} from '../../../../configs'
const FormItem = Form.Item
const FIRST_PAGE = 1
const PAGE_SIZE = 10
const RangePicker = DatePicker.RangePicker

class SearchModule extends Component {
  
  constructor(props) {
    super(props)
    this.state = {}
  }
  //查询
  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      actions: { fetchSceneConfigList, setCurrentPageIndex,setSceneConfigSearchParams } } = this.props
    const values = form.getFieldsValue()
    values.pageNo = FIRST_PAGE
    values.pageSize = PAGE_SIZE
    setSceneConfigSearchParams(values)
    fetchSceneConfigList(values)
    setCurrentPageIndex(1)
  }
 
  handleReset = (e) => {
    e.preventDefault()
    const {
      form,
    } = this.props
    form.resetFields()
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }
    const { form } = this.props
    const { getFieldDecorator,} = form
    const FORM_ITEM_SPAN = 8
    return (
      <div className="push_center_search_module">
        <Module color="blue" style={{ marginTop: 20 }}>
          <Form
            onSubmit={this.handleSubmit}
            onReset={this.handleReset}
          >
            <Row>
              <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="场景ID"
                  {...formItemLayout}
                >
                  {getFieldDecorator('id')(
                    <Input placeholder="请输入场景ID" />,
                  )}
                </FormItem>
              </Col>
              <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="场景名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('sceneName')(
                    <Input placeholder="请输入场景名称" />,
                  )}
                </FormItem>
              </Col>
              <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="创建人"
                  {...formItemLayout}
                >
                  {getFieldDecorator('operator')(
                    <Input placeholder="请输入创建人"/>,
                  )}

                </FormItem>
              </Col>
            </Row>
            <Row>
              {/* <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="创建时间"
                  {...formItemLayout}
                >
                  {getFieldDecorator('createTime')(
                    <RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['开始时间', '结束时间']}
                      allowClear
                    />,
                  )}

                </FormItem>
              </Col> */}
              <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="业务线"
                  {...formItemLayout}
                >
                  {getFieldDecorator('bizLine')(
                    <Select placeholder="请选择选择业务线" allowClear>
                      {
                        PUSH_TOOL_BUSINESSES
                      && PUSH_TOOL_BUSINESSES.map(cur => (
                        <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                      ))
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={FORM_ITEM_SPAN}>
                <FormItem
                  label="状态"
                  {...formItemLayout}
                >
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择场景配置状态" allowClear>
                      {
                        SCENE_CONFIG_STATUS
                    && SCENE_CONFIG_STATUS.map(cur => (
                      <Select.Option key={cur.id} value={cur.id}>{cur.name}</Select.Option>
                    ))
                      }
                    </Select>,
                  )}

                </FormItem>
              </Col>
              <Col span={FORM_ITEM_SPAN} style={{textAlign:"center"}}>
                <Button style={{ marginRight: 10}} 
                  size="default" type="primary" htmlType="submit">筛选</Button>
                <Button size="default" htmlType="reset">清空</Button>
              </Col>
            </Row>
            {/* <Row>
              <Col span={24} style={{textAlign:"center"}}>
                <Button style={{ marginRight: 10}} 
                  size="default" type="primary" htmlType="submit">筛选</Button>
                <Button size="default" htmlType="reset">清空</Button>
              </Col>
            </Row> */}
            
          </Form>
        </Module>
      </div>
    )
  }

}

export default connect(state => ({
 
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SearchModule))