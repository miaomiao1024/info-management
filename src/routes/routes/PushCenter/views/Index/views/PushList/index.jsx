import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import T from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Form,
  Button,
  Pagination,
} from 'antd'
import List from './List'
import {
  ModuleTitle,
} from '@components'
import { actions } from '@modules/PushCenter'

const FIRST_PAGE = 1
const PAGE_SIZE = 10

class PushList extends Component {
  static propTypes = {
    activityListData: T.object.isRequired,
    actions: T.object.isRequired,
    seartchParams: T.object.isRequired,
    pageIndex: T.number.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      // currentPage: 0,
    }
  }
  componentWillMount() {
    this.fetchList(FIRST_PAGE)
  }
  onPageChange = (page) => {
    const seartchParams = this.props.seartchParams
    seartchParams.pageIndex = page
    seartchParams.pageSize = PAGE_SIZE
    const { fetchPushToolActivityList, setCurrentPageIndex } = this.props.actions
    fetchPushToolActivityList(this.props.seartchParams)
    setCurrentPageIndex(page)
  }
  fetchList = (page) => {
    const { fetchPushToolActivityList } = this.props.actions
    const values = {
      pageIndex: page,
      pageSize: PAGE_SIZE,
    }
    fetchPushToolActivityList(values)
  }
  render() {
    const activityList = (this.props.activityListData.data && this.props.activityListData.data.activityList) || []
    const total = (this.props.activityListData.data && parseInt(this.props.activityListData.data.totalCount)) || 0
    const current = this.props.pageIndex
    return (
      // <Module  title="活动信息列表">
      <div>
        <ModuleTitle title="活动信息列表" style={{ marginTop: 20 }}>
          {
            <div>
              {/* <Link to="/group/push/new">
                <Button type="primary" disabled>批量审批</Button>
              </Link> */}
              <Link to="/customer/push/new" style={{ marginLeft: '10px' }}>
                <Button type="primary">+ 新建推送</Button>
              </Link>
            </div>
          }
        </ModuleTitle>
        <section>
          {activityList.map((cur, index) => (
            <List key={index} item={cur} />
          ))}
          <Pagination
            total={total}
            current={current}
            pageSize={PAGE_SIZE}
            onChange={(page) => { this.onPageChange(page) }}
            showTotal={() => `共 ${total} 条数据`}
            style={{ textAlign: 'right' }}
          />
        </section>
        {/* </Module> */}
      </div>
    )
  }

}
export default connect(state => ({
  activityListData: state.pushCenter.activityListData,
  seartchParams: state.pushCenter.seartchParams,
  pageIndex: state.pushCenter.pageIndex,
}),
dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(Form.create()(PushList))
