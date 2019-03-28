import React, { Component } from 'react';
import './index.css'
import { Button, Form, Row, Col, Select, Table, } from 'antd'
import {
  SELECT_HOME_WORK_NUM,
}from './configs'
const FormItem = Form.Item
const Option = Select.Option
const FIRST_PAGE = 1
const PAGE_SIZE = 10
  
class Homework extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      total: 0,     
    }
  } 
  render() {
    const {
      data,
      current,
      total,
      size,
    } = this.state
    return (
      <div className="report-page">
        <Row>
          <Col style={{fontSize:'18px',fontWeight:800,paddingBottom:'30px'}}>
            入廊作业
          </Col>
        </Row>
        <div className='search-and-select'>  
          <Row>
            <Col span='6'>
              活动范围：
              <Select placeholder="请选择活动范围" style={{ width: 220 }}>
                {
                  SELECT_HOME_WORK_NUM &&
                  SELECT_HOME_WORK_NUM.map(cur => (
                    <Option value={cur.id}>{cur.name}</Option>
                  ))
                }
              </Select>
            </Col>
            <Col span='6'>
              <Button type='primary'> + 添加如廊作业</Button>
            </Col>
          </Row> 
        </div>
        <Table
            className="group-list-module"
            bordered
            pagination={{
              current,
              total,
              pageSize: size,
              onChange: this.handlePageChagne,
              showTotal: () => `共 ${total} 条数据`,
            }}
            dataSource={data}
            columns={[{
              title: '排列序号',
              key: 'tagId',
              render: (text, record) => (record.tagId && record.tagId) || '--',
            }, {
              title: '工期',
              key: 'tagName',
              render: (text, record) => (record.tagName && record.tagName) || '--',
            }, {
              title: '创建时间',
              key: 'tagType',
              render: (text, record) => (record.type && record.type.name) || '--',
            }, {
              title: '施工人员数量',
              dataIndex: 'actualUserCount',
              render: (text, record) => `${record.type.id === '3'
                ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
            }, {
              title: '活动范围',
              dataIndex: 'creatorNameZh',
              render: (text, record) => `${record.creatorNameZh || ''}`,
            }, {
              title: '评价',
              key: 'createTime',
              render: (text, record) => `${record.createTime}`,
            }, {
              title: '操作',
              render: (text, record, index) => (
                <div className="operate-btns" style={{ display: 'block' }}>
                  <Button type="simple">编辑</Button>
                  <Button type="simple">详情</Button>
                  <Button type="simple">删除</Button>
                  <Button type="simple">评价</Button>
                </div>
              ),
            }]}
          />
      </div>
    );
  }
}

export default Homework

