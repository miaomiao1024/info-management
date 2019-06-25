import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import T from 'prop-types'
import {
  Button, 
  Table,
} from 'antd'
import {
  ModuleTitle,
} from '@components'
import SelectTagModal from './SelectTagModal'
  
export default class SelectPackage extends Component {
  static propTypes = {
    onChange: T.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedTag: [],
    }
  }
  visibleChange = (visible) => {
    this.setState({modalVisible: visible})
  }
  selectTagChange = (selectedTag) => {
    const {onChange} = this.props
    this.setState({selectedTag})
    onChange(selectedTag)
  }
  render() {
    const {modalVisible, selectedTag} = this.state
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
    }]
    return (
      <div>
        <ModuleTitle title="PUSH人群包选择" />
        <div className="push-create-container">
          <div style={{ margin: '10px' }}>
            <span>选择人群包</span>
            <Button
              type="primary"
              style={{ margin: '0 10px' }}
              onClick={() => {this.visibleChange(true)}}
            >更改人群标签</Button>
            <span>没找到想要的人群？<Link to="/customer/tag/new">去创建人群标签</Link></span>
          </div>
          <Table
            columns={columns}
            dataSource={selectedTag}
            bordered
            pagination={false}
            rowKey="tagId"
          />
          <SelectTagModal
            visible={modalVisible}
            hideModal={()=>{this.visibleChange(false)}}
            onChange={this.selectTagChange}
            visibleType = "1"
          />
        </div>
      </div>
    )
  }
}