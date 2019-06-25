import {
  combineReducers,
} from 'redux'
import {
  FETCH_USER_TAG_CATEGORY,
  FETCH_USER_TAG_CATEGORY_SUCCESS,
  FETCH_USER_TAG_CATEGORY_FAIL, 
  FETCH_USER_TAG_CLEAR_CATEGORY,
  GET_METRIC_DETAIL,
  GET_MATRIC_EDTAIL_SUCCESS,
  GET_METRIC_DETAIL_FAIL,
  SELECT_USER_TAG_CATEGORY_ITEM,
  FETCH_CATEGORY_GET_DETAIL,
  FETCH_CATEGORY_GET_DETAIL_SUCCESS,
  FETCH_CATEGORY_GET_DETAIL_FAIL,
  
  GET_METRIC_LIST,
  GET_METRIC_LIST_SUCCESS,
  GET_METRIC_LIST_FAIL,
  GET_CATEGORY_LIST,
  GET_CATEGORY_LIST_SUCCESS,
  GET_CATEGORY_LIST_FAIL,
} from './actionTypes'

  
const fetchCategoryData = (state = {
  isFetching: false,
  fetched: false, // 成功获取过一次之后更新为true
  data: [],
}, action) => {
  switch (action.type) {
  case FETCH_USER_TAG_CATEGORY:
    return {
      ...state,
      isFetching: true, 
    }
  case FETCH_USER_TAG_CATEGORY_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case FETCH_USER_TAG_CATEGORY_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  case FETCH_USER_TAG_CLEAR_CATEGORY:
    return {
      ...state,
      data: [],
    }
  default:
    return state
  }
}
  
const getMatricDetail = (state = {
  isFetching: false,
  fetched: false,
  data: [],
},action) => {
  switch (action.type) {
  case GET_METRIC_DETAIL:      
    return {
      ...state,
      isFetching: true,
    }
  case GET_MATRIC_EDTAIL_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case GET_METRIC_DETAIL_FAIL:
    return {
      ...state,
      data:[],
    }
  default:
    return state
  }
}


const fetchMetricList = (state = {
  isFetching: false,
  fetched: false, 
  data: [],
}, action) => {
  switch (action.type) {
  case GET_METRIC_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case GET_METRIC_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case GET_METRIC_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}

const fetchCategoryList = (state = {
  isFetching: false,
  fetched: false, 
  data: [],
}, action) => {
  switch (action.type) {
  case GET_CATEGORY_LIST:
    return {
      ...state,
      isFetching: true,
    }
  case GET_CATEGORY_LIST_SUCCESS:
    return {
      data: action.payload,
      isFetching: false,
      fetched: true,
    }
  case GET_CATEGORY_LIST_FAIL:
    return {
      ...state,
      isFetching: false,
    }
  default:
    return state
  }
}


const selectUserTagCategoryItem = (state = 0, action) => {
  switch (action.type) {
  case SELECT_USER_TAG_CATEGORY_ITEM:
    return action.payload
  default:
    return state
  }
}


export default combineReducers({
  metricList: fetchMetricList,
  categoryList: fetchCategoryList,
  category: fetchCategoryData,
  metricDetail: getMatricDetail,
  currentCategory: selectUserTagCategoryItem,
})
