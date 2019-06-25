import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import T from 'prop-types'
import {
  Button,
  Table,
  Form,
} from 'antd'
import {
  ModuleTitle,
} from '@components'
import SelectTagModal from '../../SelectTag/SelectTagModal'
import './index.styl'

class DeliveryStrategy extends Component {
  static propTypes = {
    onChange: T.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedTagGroup: [],
      CheckedItem: false,
    }
  }


  visibleStrategy = (visible) => {
    this.setState({ 
      modalVisible: visible ,
      CheckedItem: false,
    })
  }
  selectTagChange = (group) => {
    const { onChange } = this.props
    this.setState({ selectedTagGroup: group })
    onChange(group[0].tagId)
  }
  deleteStrategy = () => {
    const { onChange } = this.props
    this.setState({ 
      selectedTagGroup: [],
      CheckedItem: true,
    })
    onChange([])
  }
  render() {
    const {
      form,
    } = this.props
    const {
      getFieldDecorator,
    } = form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    const { modalVisible, selectedTagGroup ,CheckedItem} = this.state
    const columns = [{
      title: '标签ID',
      dataIndex: 'tagId',
      render: (text, record) => (record.tagId && record.tagId) || '--',
    }, {
      title: '标签名称',
      dataIndex: 'tagName',
      render: (text, record) => (record.tagName && record.tagName) || '--',
    }, {
      title: '标签类型',
      dataIndex: 'tagType',
      render: (text, record) => (record.type && record.type.name) || '--',
    }, {
      title: '用户数',
      dataIndex: 'actualUserCount',
      render: (text, record) => `${record.type.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: (text, record) => `${record.creatorNameZh || ''}`,
    }, {
      title: '创建/更新时间',
      dataIndex: 'createTime',
      render: (text, record) => `${record.createTime}`,
    }, {
      title: '最近使用时间',
      dataIndex: 'operateTime',
      render: (text, record) => `${record.operateTime}`,
    }, {
      title: '人群包状态',
      dataIndex: 'status',
      render: (text, record) => `${(record.status && record.status.name) || '--'}`,
    }, {
      title: '详情',
      dataIndex: 'detail',
      render: (text, record) => (
        <Link to={`/customer/tag/detail/${record.tagId}`}>
          <span>详情</span>
        </Link>
      ),
    }, {
      title: '删除',
      dataIndex: 'delete',
      render: (text, record) => (
        <Button className="btn-style"
          style={{ border: 'none', padding: 0, color: '#357aff', background: "transparent", fontSize: "12px" }}
          type="simple"
          onClick={this.deleteStrategy}
        >删除
        </Button>
      ),
    }]
    return (
      <div>
        <ModuleTitle title="投放策略配置" />
        <div className="push-create-container">
          <Form>
            <Form.Item
              label="选择人群包"
              {...formItemLayout}
            >
              {getFieldDecorator('delivery-strategy')(
                <div>
                  <Button
                    type="primary"
                    style={{ marginBottom: '10px' }}
                    onClick={() => { this.visibleStrategy(true) }}
                  >选择人群包</Button>
                  <span
                    className="push-center-tip"
                  >
                    &nbsp;&nbsp; (选择后，投放规则仅对人群包范围内用户有效)
                  </span>
                  {selectedTagGroup &&
                    selectedTagGroup.length > 0 &&
                    <Table
                      columns={columns}
                      dataSource={selectedTagGroup}
                      bordered
                      pagination={false}
                      rowKey="tagId"
                    />
                  }
                  <SelectTagModal
                    visible={modalVisible}
                    hideModal={() => { this.visibleStrategy(false) }}
                    onChange={this.selectTagChange}
                    visibleType="2"
                    deleteHidden={CheckedItem}
                  />
                </div>
              )}
            </Form.Item>
          </Form>
        </div>

      </div>
    )
  }
}
export default Form.create()(DeliveryStrategy)