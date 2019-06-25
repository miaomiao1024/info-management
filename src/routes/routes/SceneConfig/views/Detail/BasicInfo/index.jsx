import React, { Component } from 'react'
import {
  Row,
  Col,
} from 'antd'
import T from 'prop-types'
import '../index.styl'
import moment from 'moment'

export default class extends Component {
  static propTypes ={
    data: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = { index: 0 }
    this.infos = [{
      title: '场景ID',
      dataIndex: 'id',
      render: record => record.id,
    }, {
      title: '场景名称',
      dataIndex: 'sceneName',
      render: record => record.sceneName || '',
    }, {
      title: '场景描述',
      dataIndex: 'sceneDesc',
      render: record => record.sceneDesc || '',
    }, {
      title: '业务线',
      dataIndex: 'bizLineName',
      render: record => record.bizLineName || '',
    }, {
      title: '事件类型',
      dataIndex: 'eventId',
      render: record => record.eventId || '',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      render: record => (record.startTime && 
        moment(JSON.parse(record.startTime)).format('YYYY-MM-DD HH:mm:ss'))|| '',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      render: record => (record.endTime && 
        moment(JSON.parse(record.endTime)).format('YYYY-MM-DD HH:mm:ss')) || '',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: record => (record.createTime && 
        moment(JSON.parse(record.createTime)).format('YYYY-MM-DD HH:mm:ss')) || '',
    },{
      title: '更新时间',
      dataIndex: 'updateTime',
      render: record => (record.updateTime && 
        moment(JSON.parse(record.updateTime)).format('YYYY-MM-DD HH:mm:ss')) || '',
    },{ 
      title: '状态',
      dataIndex: 'status',
      render: record => (record.status && record.status) || '',
    },{ 
      title: '创建人中文名称',
      dataIndex: 'operatorZh',
      render: record => record.operatorZh || '',
    },{ 
      title: '创建人英文名称',
      dataIndex: 'operator',
      render: record => record.operator || '',
    },
    ]
  }

  render() {
    const { data }  = this.props
    console.log(data)
    const detailInfo = (cur, datas) => {
      let result = []
      if (cur.render) { 
        result.push(cur.render(datas)) 
      } else {
        result = Object.prototype.toString.call(datas[cur.dataIndex]) === '[object Object]'
          ? datas[cur.dataIndex].name
          : datas[cur.dataIndex]
      }
      return result 
    }
    return (
      <div>
        <Row gutter={60}>
          {
            this.infos.map(cur => (
              <Col span={12}>
                <div className="label-container">
                  { cur.title &&
                    <span className="title">{cur.title}</span>
                  }
                  { cur.title && 
                    <span>:&nbsp;</span>
                  }
                  <span className="content">{detailInfo(cur, data)}</span>
                </div>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}
