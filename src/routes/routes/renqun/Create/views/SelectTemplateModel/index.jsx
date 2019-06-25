import React, {
  Component,
} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
//import moment from 'moment'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
} from 'antd'
import { fetch, json } from '@didi/fate-common'
import {
  Modal,
} from '@components'
import { actions } from '@modules/CrowdTag'
import './index.styl'

const FIRST_PAGE = 1
const PAGE_SIZE = 10
const { jsonToParams } = json
class SelectTemplateModel extends Component {
  static defaultProps = {
    visible: false,
  }
  static propTypes = {
    visible: T.bool,
    form: T.object.isRequired,
    actions: T.object.isRequired,
    templates: T.array.isRequired,
    templateModelVisable: T.bool.isRequired,
    currentTab: T.bool.isRequired,
    idType: T.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible || false,
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      total: 0,
    }
  }
  componentDidMount() {
    this.fetchList(0)
  }
  componentWillReceiveProps(nextProps) {
    const { templates: { itemCount, pageIndex } } = this.props
    if (pageIndex != nextProps.templates.pageIndex) {
      this.setState({
        current: nextProps.templates.pageIndex,
      })
    }
    this.setState({
      total: itemCount,
      visible: nextProps.visible,
    })
  }
  handlePageChagne = (value) => {
    this.fetchList(value)
  }
  chooseItem=(index) => {
    const { actions: { setUserTagCurrentTemplate } } = this.props
    setUserTagCurrentTemplate(index)
    this.hideModel()
  }
  deleteTemplate =(record) => {
    fetch('/api/user-tag/template/delete', {
      method: 'POST',
      data: jsonToParams({
        templateId: record.templateId,
      }),
    }).then(() => {
      this.fetchList()
    })
  }
  filterHandler = () => {
    this.fetchList(0)
  }
  clearHandler = () => {
    const { form: { resetFields } } = this.props
    resetFields()
  }
  handleCancel=() => {
    this.hideModel()
  }
  hideModel = () => {
    const { actions: { setTemplateModelVisable } } = this.props
    setTemplateModelVisable(false)
  }
  handleOk=() => {
    this.hideModel()
  }
  fetchList =(page = 0) => {
    const {
      form,
      currentTab,
      idType,
    } = this.props
    const values = form.getFieldsValue()
    const { actions: { fetchUserTagTemplates } } = this.props
    fetchUserTagTemplates({
      ...values,
      pageIndex: page,
      idType,
      pageSize: PAGE_SIZE,
      templateType: currentTab == '1' ? 1 : 2,
    })
    this.setState({ current: page })
  }
  render() {
    const {
      current,
      total,
      size,
    } = this.state
    const { templates: { items = [] } } = this.props
    const {
      form,
      templateModelVisable,
    } = this.props
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const dataSource = items

    const columns = [{
      title: '标签名称',
      dataIndex: 'templateName',
      key: 'templateName',
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      key: 'creatorNameZh',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (
        //moment(window.Number.parseInt(record.createTime)).format('YYYY/MM/DD HH:mm:ss')
        record.createTime
      ),
    }, {
      title: '操作',
      dataIndex: 'operator',
      key: 'operator',
      render: (text, record, index) => (
        <span className="template-operator">
          <Button
            onClick={() => { this.chooseItem(index) }}
          >选择</Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => { this.deleteTemplate(record) }}
          >
            <Button type="simple">删除</Button>
          </Popconfirm>
        </span>
      ),
    }]
    const {
      getFieldDecorator,
    } = form
    return (
      <Modal
        visible={templateModelVisable}
        title="人群标签模版"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="select-coupon-modal"
        size="default"
      >
        <Form>
          <Row>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="模版名称">
                {getFieldDecorator('name', {
                  initialValue: '',
                })(
                  <Input placeholder="输入模版名称模糊搜索" />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...formItemLayout} label="创建人">
                {getFieldDecorator('creatorNameZh', {
                  initialValue: '',
                })(
                  <Input placeholder="输入创建人账号名称" />,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button onClick={this.filterHandler} size="default" style={{ margin: '0 10px', width: '40%' }}>筛选</Button>
              <Button onClick={this.clearHandler} size="default" style={{ margin: '0 10px', width: '40%' }}>清空</Button>
            </Col>
          </Row>
          <Row>
            <Table
              pagination={{
                current,
                total,
                pageSize: size,
                onChange: this.handlePageChagne,
                showTotal: () => `共 ${total} 条数据`,
              }}
              dataSource={dataSource}
              columns={columns}
            />
          </Row>
        </Form>
      </Modal>
    )
  }
}
export default connect(state => ({
  templates: state.crowdTag.templates.data,
  templateModelVisable: state.crowdTag.templateModelVisable,
  currentTab: state.crowdTag.currentTab,
  idType: state.crowdTag.idType,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(SelectTemplateModel))
