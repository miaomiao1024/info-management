import {
  FETCH_PUSH_TOOL_ACTIVITY_LIST,
  FETCH_PUSH_TOOL_ACTIVITY_LIST_SUCCESS,
  FETCH_PUSH_TOOL_ACTIVITY_LIST_FAIL,
  FETCH_PUSH_TOOL_DETAIL,
  FETCH_PUSH_TOOL_DETAIL_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_FAIL,
  SET_PUSH_TOOL_TAG_MODAL,
  SET_PUSH_TOOL_DOC_MODAL,
  SET_PUSH_TOOL_COUPON_MODAL,
  SET_PUSH_TOOL_SELECTED_TAG,
  SET_PUSH_TOOL_AUDIT_MODAL,
  SET_PUSH_TOOL_AUDIT_PARAMS,
  SET_PUSH_TOOL_TASKLIST_PARAMS,
  SET_PUSH_TOOL_SELECTED_COUPON,
  SET_PUSH_TOOL_COUPON_SELECT_TYPE,
  SET_PUSH_TOOL_SEARCH_PARAMS,
  FETCH_PUSH_TOOL_TEMPLATE_TAG,
  FETCH_PUSH_TOOL_TEMPLATE_TAG_FAIL,
  FETCH_PUSH_TOOL_TEMPLATE_TAG_SUCCESS,
  SET_PUSH_TOOL_TEMPLATE_TAG,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL,
  SET_PUSH_TOOL_CURRENT_PAGE_INDEX,
  SET_PUSH_TOOL_TEMPLATE_TAG_PRE,
  SET_PUSH_TOOL_PUSH_RULE,
  SET_PUSH_TOOL_ACTIVATED_TAB,
  FETCH_PUSH_TOOL_COUPON_LIST,
  FETCH_PUSH_TOOL_COUPON_LIST_SUCCESS,
  FETCH_PUSH_TOOL_COUPON_LIST_FAIL,
  SET_PUSH_TOOL_COUPON_LIST_PARAMS,
  PUSH_TOOL_IS_XIAOJU_PUSH_CHECKED,
  PUSH_SELECTED_BIZLINE_PARAMS,
  FETCH_PUSH_GROUP_QUERY_LIST,
  FETCH_PUSH_GROUP_QUERY_LIST_SUCCESS,
  FETCH_PUSH_GROUP_QUERY_LIST_FAIL,
  SET_PUSH_GROUP_CURRENT_PAGE_INDEX,
  SET_GROUP_QUERY_SEARCH_PARAMS,
  SET_CREATE_EXPERIMENTMODAL_MODAL,
  SET_PUSH_TOOL_EQUITY_MODAL,
  FETCH_PUSH_EQUITY_LIST,
  FETCH_PUSH_EQUITY_LIST_SUCCESS,
  FETCH_PUSH_EQUITY_LIST_FAIL,
  SAVE_EQUITY_DATA,
  SAVE_SELECT_ROWS,
  LOCKING_EQUITY_SELECTED,
} from './actionTypes'
import * as API from '../services'

export const fetchPushToolActivityList = param => async (dispatch, getState) => {
  const { pushCenter: { activityListData: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_TOOL_ACTIVITY_LIST,
    })
    const data = await API.fetchPushToolActivityList(param)
    dispatch({
      type: FETCH_PUSH_TOOL_ACTIVITY_LIST_SUCCESS,
      payload: data,
    })
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_TOOL_ACTIVITY_LIST_FAIL,
    })
  }
}
// 查询详情
/* export const getPushDetailDataAsync = payload => ({
  type: FETCH_PUSH_TOOL_DETAIL_ASYNC,
  payload,
}) */

export const fetchPushToolDetail = params => async (dispatch, getState) => {
  const { pushCenter: { detail: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_TOOL_DETAIL,
    })

    const data = await API.fetchPushToolDetail(params)
    dispatch({
      type: FETCH_PUSH_TOOL_DETAIL_SUCCESS,
      payload: data,
    })
    try {
      if (data.userTagId === '0' || data.userTagId === 'null') {
        dispatch({
          type: FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS,
          payload: {
            isFetching: false,
            fetched: false,
            data: {},
          },
        })
      }
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_USER_TAG,
      })
      const userTagId = data.userTagId
      const userTagParams = {
        userTagId,
        pageIndex: 1,
        pageSize: 1,
      }
      const userTagData = await API.fetchUserTag({ ...userTagParams })
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS,
        payload: userTagData,
      })
    } catch (e) {
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL,
      })
    };
    //下一次请求
    try {
      if (data.taskList[0].checkPackage === null || data.taskList[0].checkPackage === 'null') {
        dispatch({
          type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS,
          payload: {
            isFetching: false,
            fetched: false,
            data: {},
          },
        })
        return
      }
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE,
      })
      const userTagId = data.taskList[0].checkPackage
      const userCheckParams = {
        userTagId,
        pageIndex: 1,
        pageSize: 1,
      }
      const userTagDatas = await API.fetchUserTag({ ...userCheckParams })
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS,
        payload: userTagDatas,
      })
    } catch (e) {
      dispatch({
        type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL,
      })
    };
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_TOOL_DETAIL_FAIL,
    })
  }
}

// 设置模版是否显示
export const setTagModal = payload => ({
  type: SET_PUSH_TOOL_TAG_MODAL,
  payload,
})

// 设置文档标签创建模板是否显示
export const setDocModal = payload => ({
  type: SET_PUSH_TOOL_DOC_MODAL,
  payload,
})

// 设置优惠券选择模板是否显示
export const setCouponModal = payload => ({
  type: SET_PUSH_TOOL_COUPON_MODAL,
  payload,
})
// 设置权益模版是否显示
export const setEquityModal = payload => ({
  type: SET_PUSH_TOOL_EQUITY_MODAL,
  payload,
})
// 选中的人群包
export const setSelectedTag = payload => ({
  type: SET_PUSH_TOOL_SELECTED_TAG,
  payload,
})

// 选中的优惠券
export const setSelectedCoupon = payload => ({
  type: SET_PUSH_TOOL_SELECTED_COUPON,
  payload,
})
// 优惠券单/多选
// export const setCouponSelectType = payload => ({
//   type: SET_PUSH_TOOL_COUPON_SELECT_TYPE,
//   payload,
// })

export const setCouponSelectType = payload => (dispatch) => {
  const data = payload === '2' ? 'checkbox' : 'radio'
  dispatch({
    type: SET_PUSH_TOOL_COUPON_SELECT_TYPE,
    payload: data,
  })
}

// 设置审核模板是否显示
export const setAuditModal = payload => ({
  type: SET_PUSH_TOOL_AUDIT_MODAL,
  payload,
})
// 设置审核传递的参数
export const setAuditParams = payload => ({
  type: SET_PUSH_TOOL_AUDIT_PARAMS,
  payload,
})
// 设置taskList的参数
export const setTaskListParams = payload => ({
  type: SET_PUSH_TOOL_TASKLIST_PARAMS,
  payload,
})

export const setPushToolSearchParams = payload => ({
  type: SET_PUSH_TOOL_SEARCH_PARAMS,
  payload,
})

// 查询详情
export const fetchPushToolTemplateTag = () => async (dispatch, getState) => {
  const { pushCenter: { templateTag: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_TOOL_TEMPLATE_TAG,
    })
    const data = await API.fetchPushToolTemplateTag()
    dispatch({
      type: FETCH_PUSH_TOOL_TEMPLATE_TAG_SUCCESS,
      payload: data,
    })
    const itemsData = data.items
    const tagData = itemsData.map(item => Object.assign(item, { checkedCount: 0 }))
    dispatch({
      type: SET_PUSH_TOOL_TEMPLATE_TAG,
      payload: tagData,
    })
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_TOOL_TEMPLATE_TAG_FAIL,
    })
  }
}

export const setTemplateTag = payload => ({
  type: SET_PUSH_TOOL_TEMPLATE_TAG,
  payload,
})

export const setPreTemplateTag = payload => ({
  type: SET_PUSH_TOOL_TEMPLATE_TAG_PRE,
  payload,
})

export const setCurrentPageIndex = payload => ({
  type: SET_PUSH_TOOL_CURRENT_PAGE_INDEX,
  payload,
})


export const setPushRule = payload => ({
  type: SET_PUSH_TOOL_PUSH_RULE,
  payload,
})
export const setActivatedTab = payload => ({
  type: SET_PUSH_TOOL_ACTIVATED_TAB,
  payload,
})

export const setCouponListParams = payload => ({
  type: SET_PUSH_TOOL_COUPON_LIST_PARAMS,
  payload,
})

export const fetchPushToolCouponList = param => async (dispatch, getState) => {
  const { pushCenter: { activityListData: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_TOOL_COUPON_LIST,
    })
    const data = await API.fetchPushToolCouponList(param)
    dispatch({
      type: FETCH_PUSH_TOOL_COUPON_LIST_SUCCESS,
      payload: data,
    })
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_TOOL_COUPON_LIST_FAIL,
    })
  }
}

// 小桔车服端外push是否被勾选
export const isXiaojuPushChecked = payload => ({
  type: PUSH_TOOL_IS_XIAOJU_PUSH_CHECKED,
  payload,
})
//选择业务线右侧mobile回显
export const selectedBizLineParams = payload => ({
  type: PUSH_SELECTED_BIZLINE_PARAMS,
  payload,
})
//获取关联营销活动查询列表
export const fetchPushGroupQueryList = param => async (dispatch, getState) => {
  const { pushCenter: { groupListData: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_GROUP_QUERY_LIST,
    })
    const data = await API.fetchPushGroupQueryListApi(param)
    dispatch({
      type: FETCH_PUSH_GROUP_QUERY_LIST_SUCCESS,
      payload: data,
    })
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_GROUP_QUERY_LIST_FAIL,
    })
  }
}
//获取权益列表
export const fetchPushToolEquityList = param => async (dispatch, getState) => {
  const { pushCenter: { equityListData: { isFetching } } } = getState()
  if (isFetching) return
  try {
    dispatch({
      type: FETCH_PUSH_EQUITY_LIST,
    })
    const data = await API.fetchPushToolEquityListApi(param)
    dispatch({
      type: FETCH_PUSH_EQUITY_LIST_SUCCESS,
      payload: data,
    })
  } catch (e) {
    dispatch({
      type: FETCH_PUSH_EQUITY_LIST_FAIL,
    })
  }
}



//获取查询列表当前页
export const setGroupCurrentPageIndex = payload => ({
  type: SET_PUSH_GROUP_CURRENT_PAGE_INDEX,
  payload,
})
//存放搜索参数
export const setGroupQuerySearchParams = payload => ({
  type: SET_GROUP_QUERY_SEARCH_PARAMS,
  payload,
})
//创建成功才会隐藏实验配置的模态框
export const createExperimentModal = payload => ({
  type:SET_CREATE_EXPERIMENTMODAL_MODAL,
  payload,
})

//存放选中的关联营销活动
export const saveEquityData = payload => ({
  type:SAVE_EQUITY_DATA,
  payload,
})
//存放选中的权益
export const saveSelectRow = payload => ({
  type:SAVE_SELECT_ROWS,
  payload,
})
//选择权益后不允许更改运营活动
export const lockingEquitySelected = payload => ({
  type:LOCKING_EQUITY_SELECTED,
  payload,
})