import { 
  put, 
  call, 
  takeEvery, 
} from 'redux-saga/effects'
import {
  GET_METRIC_LIST_ASYNC,
  GET_METRIC_LIST,
  GET_METRIC_LIST_SUCCESS,
  GET_METRIC_LIST_FAIL,
  GET_CATEGORY_LIST_ASYNC,
  GET_CATEGORY_LIST,
  GET_CATEGORY_LIST_SUCCESS,
  GET_CATEGORY_LIST_FAIL,

  FETCH_USER_TAG_INQUIRE_ASYNC,
  FETCH_USER_TAG_INQUIRE,
  FETCH_USER_TAG_INQUIRE_SUCCESS,
  FETCH_USER_TAG_INQUIRE_FAIL,
  
  GET_METRIC_DETAIL_ASYNC,
  GET_METRIC_DETAIL,
  GET_METRIC_DETAIL_FAIL,
  GET_MATRIC_EDTAIL_SUCCESS,
  FETCH_USER_TAG_CATEGORY_SUCCESS,
  FETCH_USER_TAG_CATEGORY_FAIL,
  FETCH_USER_TAG_CATEGORY,
} from './actionTypes'
import * as API from '../services'

//获取指标管理list
function* fetchMetricListAsync({ payload }) {
  try {
    yield put({ type: GET_METRIC_LIST })
    const data = yield call(API.fetchMetricListApi, payload)
    yield put({ type: GET_METRIC_LIST_SUCCESS, payload: data })
  } catch (e) {
    yield put({ type: GET_METRIC_LIST_FAIL })
  }
}
function* watchFetchMetricListAsync() {
  yield takeEvery(GET_METRIC_LIST_ASYNC, fetchMetricListAsync)
}
//获取分类管理list
function* fetchCategoryListAsync({ payload }) {
  try {
    yield put({ type: GET_CATEGORY_LIST })
    const data = yield call(API.fetchCategoryListApi, payload)
    yield put({ type: GET_CATEGORY_LIST_SUCCESS, payload: data })
  } catch (e) {
    yield put({ type: GET_CATEGORY_LIST_FAIL })
  }
}
function* watchFetchCategoryListAsync() {
  yield takeEvery(GET_CATEGORY_LIST_ASYNC, fetchCategoryListAsync)
}

//手动选择用户类型后，查询对应的一级分类
function* fetchUserTagInquireAsync({payload,clear}){
  if(clear){
    
  }
  try{
    yield put({type:FETCH_USER_TAG_INQUIRE})
    const data = yield call(API.fetchUserTagInquireApi,payload)
    yield put({ type:FETCH_USER_TAG_INQUIRE_SUCCESS ,payload:data})
  }catch(e){
    yield put ({ type: FETCH_USER_TAG_INQUIRE_FAIL})
  }
}
function* watchFetchUserTagInquireAaync(){
  yield takeEvery(FETCH_USER_TAG_INQUIRE_ASYNC,fetchUserTagInquireAsync)
}


//编辑复现时-自动从获取数据中拿出用户类型，分级查询分类级别
function* fetchMetrcDetailAsync({payload}){
  try{
    yield put({ type: GET_METRIC_DETAIL })//
    const { items } = yield call(API.getMetricDetailApi, payload)
    yield put({ type: FETCH_USER_TAG_CATEGORY })
    const id = items[0].idType.id
    //const subCategoryId = items[0].subCategoryId
    const category = yield call(API.fetchUserTag, {idType: id, subCategoryType:'2,3'})
    yield put({ type: GET_MATRIC_EDTAIL_SUCCESS, payload: items })
    yield put({ type: FETCH_USER_TAG_CATEGORY_SUCCESS, payload: category})
       
  }catch(e){
    console.error(e)
    yield put({ type: GET_METRIC_DETAIL_FAIL })
    yield put({ type: FETCH_USER_TAG_CATEGORY_FAIL })
  }
}
function* metricDetailFlow(){
  yield takeEvery( GET_METRIC_DETAIL_ASYNC ,fetchMetrcDetailAsync)
}




export default function* saga() {
  yield [
    call(metricDetailFlow),
    call(watchFetchMetricListAsync),
    call(watchFetchCategoryListAsync),
    call(watchFetchUserTagInquireAaync)
  ]
}