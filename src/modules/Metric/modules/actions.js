import {
  FETCH_USER_TAG_CATEGORY,
  FETCH_USER_TAG_CATEGORY_SUCCESS,
  FETCH_USER_TAG_CATEGORY_FAIL, 
  FETCH_USER_TAG_CLEAR_CATEGORY,
  GET_METRIC_DETAIL_ASYNC,
  SELECT_USER_TAG_CATEGORY_ITEM,
  GET_METRIC_LIST_ASYNC,
  GET_CATEGORY_LIST_ASYNC,
  FETCH_USER_TAG_INQUIRE_ASYNC,
} from './actionTypes'
import * as API from '../services'

//根据归属用户类型获取分类
export const fetchUserTagCategory = (params,clear) => async (dispatch, getState) => {
  const { metric : { isFetching } } = getState()
  if (isFetching) return
  if (clear) {
    dispatch({
      type: FETCH_USER_TAG_CLEAR_CATEGORY,
    })
    return
  }
  try {
    dispatch({
      type: FETCH_USER_TAG_CATEGORY,    
    })
    const data = await API.fetchUserTag(params)
    dispatch({
      type: FETCH_USER_TAG_CATEGORY_SUCCESS,  
      payload: data,
    })
  } catch (e) {
    dispatch({
      type: FETCH_USER_TAG_CATEGORY_FAIL,
    })
  }
}
//获取指标详情
// export const getMetricDetailData = params => async (dispatch,getState) => {
//   const { metric : { metricDetail : { isFetching } } } = getState()
//   //const { crowdTag : { category : { isFetching } } } = getState()
//   if (isFetching) return
//   try {
//     dispatch({
//       type:GET_METRIC_DETAIL,
//     })
//     const data = await API.getMetricDetailApi(params)
//     //console.log('查看指标详情')
//     //console.log(data)
//     dispatch({
//       type:GET_MATRIC_EDTAIL_SUCCESS,
//       payload:data,
//     })
//   } catch (e){
//     dispatch({
//       type:GET_METRIC_DETAIL_FAIL,
//     })
//   }
// }
//获取metric列表信息
export const getMetricListDataAsync = payload => ({
  type: GET_METRIC_LIST_ASYNC,
  payload,
})
//获取category列表信息
export const getCategoryListDataAsync = payload => ({
  type: GET_CATEGORY_LIST_ASYNC,
  payload,
})
export const getMetricDetailDataAsync = payload => ({
  type: GET_METRIC_DETAIL_ASYNC,
  payload,
})
//根据用户归属类型查询一级分类
export const fetchUserTagDataInquireAsync = payload => ({
  type:FETCH_USER_TAG_INQUIRE_ASYNC,
  payload,
})

// 选择某一类标签
export const selectUserTagCategoryItem = payload => ({
  type: SELECT_USER_TAG_CATEGORY_ITEM,
  payload,
})
