
import {
  combineReducers,
} from 'redux'
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
  SET_PUSH_TOOL_TEMPLATE_TAG_PRE,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL,
  SET_PUSH_TOOL_CURRENT_PAGE_INDEX,
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

const fetchPushToolActivityList = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_ACTIVITY_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_ACTIVITY_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_ACTIVITY_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const fetchPushToolDetail = (state = {
  isFetching: false,
  fetched: false, 
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_DETAIL:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_FAIL:
    return {
      data: {},
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const fetchPushToolTemplateTag = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: [],
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_TEMPLATE_TAG:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_TEMPLATE_TAG_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_TEMPLATE_TAG_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const setTemplateTag = (state = [], action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_TEMPLATE_TAG:
    return action.payload
  default:
    return state
  }
}

const setPreTemplateTag = (state = [], action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_TEMPLATE_TAG_PRE:
    return action.payload
  default:
    return state
  }
}

const setTagModal = (state = false, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_TAG_MODAL:
    return action.payload
  default:
    return state
  }
}

const setDocModal = (state = { visiable: false, pushChannel: 0 }, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_DOC_MODAL:
    return { ...state, ...action.payload }
  default:
    return state
  }
}

const setCouponModal = (state = false, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_COUPON_MODAL:
    return action.payload
  default:
    return state
  }
}

const setEquityModal = (state = false, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_EQUITY_MODAL:
    return action.payload
  default:
    return state
  }
}

const setSelectedTag = (state = [], action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_SELECTED_TAG:
    return action.payload
  default:
    return state
  }
}
const setCouponSelectType = (state = 'checkbox', action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_COUPON_SELECT_TYPE:
    return action.payload
  default:
    return state
  }
}

const setSelectedCoupon = (state = [], action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_SELECTED_COUPON:
    return action.payload
  default:
    return state
  }
}

const setAuditModal = (state = false, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_AUDIT_MODAL:
    return action.payload
  default:
    return state
  }
}
const setAuditParams = (state = {}, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_AUDIT_PARAMS:
    return action.payload
  default:
    return state
  }
}
const setTaskListParams = (state = [], action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_TASKLIST_PARAMS:
    return action.payload
  default:
    return state
  }
}
const setPushToolSearchParams = (state = {}, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_SEARCH_PARAMS:
    return action.payload
  default:
    return state
  }
}

const setCurrentPageIndex = (state = 1, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_CURRENT_PAGE_INDEX:
    return action.payload
  default:
    return state
  }
}

const setPushRule = (state = '1', action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_PUSH_RULE:
    return action.payload
  default:
    return state
  }
}


const fetchPushToolDetailUserTag = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_DETAIL_USER_TAG:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}
const fetchPushToolDetailCheckPackge = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const setActivatedTab = (state = '1', action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_ACTIVATED_TAB:
    return action.payload
  default:
    return state
  }
}
const setCouponListParams = (state = {}, action) => {
  switch (action.type) {
  case SET_PUSH_TOOL_COUPON_LIST_PARAMS:
    return action.payload
  default:
    return state
  }
}

const isXiaojuPushChecked = (state = false, action) => {
  switch (action.type) {
  case PUSH_TOOL_IS_XIAOJU_PUSH_CHECKED:
    return action.payload
  default:
    return state
  }
}

const selectedBizLineParams = (state = {}, action) => {
  switch (action.type) {
  case PUSH_SELECTED_BIZLINE_PARAMS:
    return action.payload
  default:
    return state
  }
}

const fetchPushToolCouponList = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_TOOL_COUPON_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_TOOL_COUPON_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_TOOL_COUPON_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const fetchPushGroupQueryList = (state = {
  isFetching: false,
  fetched: false, 
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_GROUP_QUERY_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_GROUP_QUERY_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_GROUP_QUERY_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const setGroupCurrentPageIndex = (state = 1, action) => {
  switch (action.type) {
  case SET_PUSH_GROUP_CURRENT_PAGE_INDEX:
    return action.payload
  default:
    return state
  }
}

const setGroupQuerySearchParams = (state = {}, action) => {
  switch (action.type) {
  case SET_GROUP_QUERY_SEARCH_PARAMS:
    return action.payload
  default:
    return state
  }
}

const createExperimentModal = (state=false,action)=> {
  switch (action.type) {
  case SET_CREATE_EXPERIMENTMODAL_MODAL:
    return action.payload
  default:
    return state
  }
}
const fetchPushToolEquityList = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: {},
}, action) => {
  switch (action.type) {
  case FETCH_PUSH_EQUITY_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case FETCH_PUSH_EQUITY_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_PUSH_EQUITY_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}
const saveEquityData = (state=[],action)=> {
  switch (action.type) {
  case SAVE_EQUITY_DATA:
    return action.payload
  default:
    return state
  }
}
const saveSelectRow = (state=[],action)=> {
  switch (action.type) {
  case SAVE_SELECT_ROWS:
    return action.payload
  default:
    return state
  }
}


const lockingEquitySelected = (state=false,action)=> {
  switch (action.type) {
  case LOCKING_EQUITY_SELECTED:
    return action.payload
  default:
    return state
  }
}


export default combineReducers({
  activityListData: fetchPushToolActivityList,
  detail: fetchPushToolDetail,
  isShowTagModal: setTagModal,
  docModal: setDocModal,
  isShowCouponModal: setCouponModal,
  isShowEquityModal:setEquityModal,
  selectedTag: setSelectedTag,
  isShowAuditModal: setAuditModal,
  auditParams: setAuditParams,
  taskListParams: setTaskListParams,
  selectedCoupon: setSelectedCoupon,
  couponSelectType: setCouponSelectType,
  seartchParams: setPushToolSearchParams,
  templateTagData: fetchPushToolTemplateTag,
  templateTag: setTemplateTag,
  preTemplateTag: setPreTemplateTag,
  userTagInfo: fetchPushToolDetailUserTag,
  userTagPackge:fetchPushToolDetailCheckPackge,
  pageIndex: setCurrentPageIndex,
  pushRule: setPushRule,
  activatedTab: setActivatedTab,
  couponList: fetchPushToolCouponList,
  couponListParams: setCouponListParams,
  mobileTitle:selectedBizLineParams,
  groupListData:fetchPushGroupQueryList,
  pageCurrent:setGroupCurrentPageIndex,
  groupSeartchParams : setGroupQuerySearchParams,
  visiableModalParams:createExperimentModal,
  equityListData:fetchPushToolEquityList,
  saveData:saveEquityData,
  selectedEquity:saveSelectRow,
  lockingState:lockingEquitySelected,
  isXiaojuPushChecked,
})
