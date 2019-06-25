import React, { Component } from 'react'
import {
  Row,
  Col,
  Tooltip,
  Button,
  Input,
  message,
} from 'antd'
import T from 'prop-types'
import { 
  bindActionCreators 
} from 'redux'
import {
  connect,
} from 'react-redux'
import { actions } from '@modules/CrowdTag'

class BasicInfo extends Component {
  static propTypes ={
    data: T.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = { 
      index: 0,
      value:'' ,
      result:''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.infos = [{
      title: '人群标签名称',
      dataIndex: 'userTagName',
      render: record => record.userTagName,
    }, {
      title: '人群标签ID',
      dataIndex: 'userTagId',
      render: record => record.userTagId || '',
    }, {
      title: '人群标签类型',
      dataIndex: 'userTagType',
      render: record => (record.userTagType && record.userTagType.name) || '',
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: record => record.creatorNameZh || '',
    }, {
      title: '用户数量',
      dataIndex: 'actualAmount',
      render: record => `${record.userTagType && record.userTagType.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
    }, {
      title: '创建时间',
      dataIndex: 'type',
      render: record => `${record.createTime}` || '',
    }, {
      title: '最近使用时间',
      dataIndex: 'operateTime',
      render: record => `${record.operateTime}` || '',
    }, {
      title: '用户类型',
      dataIndex: 'userIdType',
      render: record => (record.userIdType && record.userIdType.name) || '',
    }, {
      title: '黑名单',
      dataIndex: 'blackList',
      render: record => (record.blackList && record.blackList) || '无',
    }, {
      title: '白名单',
      dataIndex: 'whiteList',
      render: record => (record.whiteList && record.whiteList) || '无',
    }, {
      title: '下载地址',
      dataIndex: 'downloadUrl',
      render: record =>
        (<Tooltip
          placement="top"
          title={[
            <p>{record.downloadUrl || ''}</p>,
          ]}
        >
          {record.downloadUrl || ''}</Tooltip>),
    },{
      title: '下载',
      render: record => (
        <div>
          {
            (record.userTagType && (record.userTagType.id === '1' || record.userTagType.id === '2'))&&
            <Button size='small' type="primary" onClick={() => {this.downloadPointUrl(record)}}>点击下载</Button>
          }
        </div> 
      )       
    },]
    this.infosInTime = [{
      title: '人群标签名称',
      dataIndex: 'userTagName',
      render: record => record.userTagName,
    }, {
      title: '人群标签ID',
      dataIndex: 'userTagId',
      render: record => record.userTagId || '',
    }, {
      title: '人群标签类型',
      dataIndex: 'userTagType',
      render: record => (record.userTagType && record.userTagType.name) || '',
    }, {
      title: '创建人',
      dataIndex: 'creatorNameZh',
      render: record => record.creatorNameZh || '',
    }, {
      title: '用户数量',
      dataIndex: 'actualAmount',
      render: record => `${record.userTagType && record.userTagType.id === '3'
        ? (record.actualAmount === '0' ? '--' : record.actualAmount) : (record.actualAmount || 0)}`,
    }, {
      title: '创建时间',
      dataIndex: 'type',
      render: record => `${record.createTime}` || '',
    }, {
      title: '最近使用时间',
      dataIndex: 'operateTime',
      render: record => `${record.operateTime}` || '',
    }, {
      title: '用户类型',
      dataIndex: 'userIdType',
      render: record => (record.userIdType && record.userIdType.name) || '',
    }, {
      title: '黑名单',
      dataIndex: 'blackList',
      render: record => (record.blackList && record.blackList) || '无',
    }, {
      title: '白名单',
      dataIndex: 'whiteList',
      render: record => (record.whiteList && record.whiteList) || '无',
    },]
    
  }
  downloadPointUrl = (record) => {
    const targerUrl = `/api/user-tag/download?tagId=${record && (record.userTagId)}`
    const aEl = document.createElement('a')
    aEl.href = targerUrl
    aEl.style.display = 'none'
    document.body.appendChild(aEl)
    aEl.click()
    document.body.removeChild(aEl)
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const reg = /^[0-9]*$/
    if (this.state.value && !(reg.test(this.state.value))) {
      message.info('请输入正确用户ID（仅由数字组成）')
      return
    }
    const values = {}
    values.tagId = this.props.data.userTagId
    values.passportUid = this.state.value
    const {
      actions: { fetchUserTagCheck } , 
    } = this.props
    fetchUserTagCheck(values)
  }
  render() {
    const { data } = this.props
    const { check : { tagId }} = this.props
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
          {data.downloadUrl ?
            this.infos.map(cur => (
              cur.dataIndex === 'actualAmount' && data.userTagType
              && data.userTagType.id === '3' && data.actualAmount === '0' ?
                null 
                : 
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
            :
            this.infosInTime.map(cur => (
              cur.dataIndex === 'actualAmount' && data.userTagType
              && data.userTagType.id === '3' && data.actualAmount === '0' ?
                null 
                : 
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
        {data.userTagId && 
        <from>       
          <Row>
            <Col span={10} offset={1}>
              <Row>
                <Col span={18}>
                  <label>
                    <Input
                      type="text"
                      value={this.state.value} 
                      onChange={this.handleChange}  
                      placeholder='请输入待查询用户ID' 
                    /> 
                  </label>
                </Col>
                <Col span={5} offset={1}>
                  <Button type='primary' onClick={this.handleSubmit}>用户判断</Button> 
                </Col>
              </Row>             
            </Col>
            <Col span={10} style={{color:'blue',fontSize:'18px',marginTop:'2px'}}>
              <span>{tagId}</span>
            </Col>
          </Row>
        </from>
        }       
      </div>
    )
  }
}
export default connect(
  state => ({
    check: state.crowdTag.check.data,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(BasicInfo)
