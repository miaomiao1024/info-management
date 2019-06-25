import React, { Component, } from 'react'
import T from 'prop-types'
import {
  bindActionCreators
} from 'redux'
import { actions } from '@modules/SceneConfig'
import { Table, Form,Popconfirm, Button,message} from 'antd'
import './index.styl'
import { Link } from 'react-router-dom'
import { connect, } from 'react-redux'
import moment from 'moment'
import {
  fetch,
} from '@didi/fate-common'
import {
  SCENE_CONFIG_STATUS,
  SCENE_CONFIG_USER_TYPE,
} from '../../../../configs'

const FIRST_PAGE = 1
const PAGE_SIZE = 10

class SceneList extends Component {
  static defaultProps = {
    query: {},
  }
  static propTypes = {
    
  }
  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      experimentList: [],
      page:0,
    }
  }
  componentWillMount() {
    this.getSceneConfigList(FIRST_PAGE)
  }

  //获取列表
  getSceneConfigList = (page) => {
    const { actions: { fetchSceneConfigList } } = this.props
    const values = {
      pageNo: page,
      pageSize: PAGE_SIZE,
    }
    fetchSceneConfigList(values)
    const { actions: {setCurrentPageIndex }} = this.props
    setCurrentPageIndex(page)
  }
  //分页
  handlePageChagne = (page) => {
    this.setState({page:page})
    const searchParams = this.props.searchParams
    searchParams.pageNo = page
    searchParams.pageSize = PAGE_SIZE
    const { actions:{setCurrentPageIndex,fetchSceneConfigList} } = this.props
    fetchSceneConfigList(this.props.searchParams)
    setCurrentPageIndex(page)
  }
  checkStatus = (value) => {
    const cur =  SCENE_CONFIG_STATUS.find(item => item.id === value)
    return cur.name
  }
  checkUserType = (value) => {
    const cur =  SCENE_CONFIG_USER_TYPE.find(item => item.id === value)
    return cur.name
  }
  //操作场景
  operateScene = (id,ope,name) => {
    const values ={}
    values.id = id
    values.operateType = ope
    values.operator = name
    fetch('/api/scene/operate/scene', {
      method: 'POST',
      data: values,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (res && res.status === 10000) {
        message.success("操作成功")
        this.getSceneConfigList(this.state.page)
      } else if (res && res.status !== 10000) {
        message.error("操作失败")
      }
    })
  }

  render() {
    const {
      size,
    } = this.state
    const data = (this.props.sceneConfigList && this.props.sceneConfigList.items) || []
    const total = (this.props.sceneConfigList && parseInt(this.props.sceneConfigList.count)) || 0
    const current = this.props.pageIndex
    const columns = [{
      title: '场景ID',
      key: 'id',
      render: (text, record) => (record.id && record.id) || '--',
    }, {
      title: '场景名称',
      key: 'sceneName',
      render: (text, record) => (record.sceneName && record.sceneName) || '--',
    }, {
      title: '场景描述',
      key: 'sceneDesc',
      render: (text, record) => (record.sceneDesc && record.sceneDesc) || '--',
    }, {
      title: '业务线',
      key: 'bizLine',
      render: (text, record) => (record.bizLineName && record.bizLineName) || '--',
    },{
      title: '开始时间',
      key: 'startTime',
      render: (text, record) => (record.endTime && record.endTime &&
        moment(JSON.parse(record.startTime)).format('YYYY-MM-DD HH:mm:ss')) || '--',
    },{
      title: '结束时间',
      key: 'endTime',
      render: (text, record) => (record.endTime && record.endTime &&
        moment(JSON.parse(record.endTime)).format('YYYY-MM-DD HH:mm:ss')) || '--',
    },{
      title: '事件类型',
      key: 'eventName',
      render: (text, record) => (record.eventName && record.eventName) || '--',
    },{
      title: '状态',
      key: 'status',
      render: (text, record) => (record.status && this.checkStatus(record.status)) || '--',
    },{
      title: '用户类型',
      key: 'userRole',
      render: (text, record) => (record.userRole && this.checkUserType(record.userRole)) || '--',
    }, {
      title: '创建时间',
      key: 'createTime',
      render: (text, record) => (record.createTime && 
        moment(JSON.parse(record.createTime)).format('YYYY-MM-DD HH:mm:ss')) || '--',
    },{
      title: '创建人',
      key: 'operatorZh',
      render: (text, record) => (record.operatorZh && record.operatorZh) || '--',
    },{
      title: '操作',
      render: (text, record, index) => (
        <div className="operate-btns" style={{ display: 'block' }}>
          {
            <Link 
              to={`/customer/scene/detail/${record.id}`}
            >详情</Link>
              || <p style={{ display: 'inline' }}>{record.message}</p>
          }
          {record.status && record.status !== "5" &&
            <Popconfirm
              title="确定要删除吗？"
              onConfirm={() => { this.operateScene(record.id,"delete",record.operatorZh) }}
            >
              <Button
                style={{ border: 'none', padding: 0, 
                  color: '#357aff', background: "transparent", fontSize: "12px",margin: "0 10px" }}
                type="simple">删除</Button>
            </Popconfirm>
          }
          {record.status && record.status === "3" && 
              <Popconfirm
                title="确定要上线吗？"
                onConfirm={() => { this.operateScene(record.id,"online",record.operatorZh) }}
              >
                <Button 
                  style={{ border: 'none', padding: 0, 
                    color: '#357aff', background: "transparent", fontSize: "12px" }}
                  type="simple">上线</Button>
              </Popconfirm> 
          }
          {record.status && record.status === "2"  &&
              <Popconfirm
                title="确定要下线吗？"
                onConfirm={() => { this.operateScene(record.id,"offline",record.operatorZh) }}
              >
                <Button 
                  style={{ border: 'none', padding: 0, 
                    color: '#357aff', background: "transparent", fontSize: "12px" }}
                  type="simple">下线</Button>
              </Popconfirm> 
          }
        </div>
      ),
    }]
    return (
      <div className="scene-config-list-module" style={{ padding: '18px 0px 0px 0px' }}>
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
          columns={columns}
        />
      </div>
    )
  }
}

//export default Form.create()(ConfigsListModule)
export default connect(
  state => ({
    sceneConfigList: state.sceneConfig.sceneConfigList.data,
    pageIndex: state.sceneConfig.pageIndex,
    searchParams: state.experiment.searchParams,
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Form.create()(SceneList))

/* const cur = categoryList.find(categoryListItem =>
    categoryListItem.category.id === value)
  if (cur) {
    setFieldsValue({ subCategoryId: cur.subCategoryList[0] &&
      cur.subCategoryList[0].id })
    this.onSearchHandler(undefined, value, (cur.subCategoryList[0] &&
      cur.subCategoryList[0].id) || 0)
  } else {
    setFieldsValue({ subCategoryId: '' })
  } */