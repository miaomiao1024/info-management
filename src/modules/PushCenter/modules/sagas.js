import {
  put,   
  call,    
  takeEvery,
} from 'redux-saga/effects'
import {
  FETCH_PUSH_TOOL_DETAIL_ASYNC,
  FETCH_PUSH_TOOL_DETAIL,
  FETCH_PUSH_TOOL_DETAIL_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_FAIL,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS,
  FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL,

} from './actionTypes'
import * as API from '../services'

function* fetchPushDetailAsync({ payload }) {
  console.log("payload")
  try {
    yield put({ type: FETCH_PUSH_TOOL_DETAIL })//
    const { data } = yield call(API.fetchPushToolDetail, payload)
    console.log(data)
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_USER_TAG })
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE })
    const userTagId = data.userTagId
    const checkPackage = data.taskList[0].checkPackage
    const userTagParams = {
      userTagId,
      pageIndex: 1,
      pageSize: 1,
    }
    const userCheckParams = {
      checkPackage,
      pageIndex: 1,
      pageSize: 1,
    }
    const userTagData = yield call(API.fetchUserTag, ...userTagParams)
    const chackpackgeData = yield call(API.fetchUserTag, ...userCheckParams)

    yield put({ type: FETCH_PUSH_TOOL_DETAIL_SUCCESS, payload: data })
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_USER_TAG_SUCCESS, payload: userTagData })
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_SUCCESS, payload: chackpackgeData })
  } catch (e) {
    console.error(e)
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_FAIL })
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_USER_TAG_FAIL })
    yield put({ type: FETCH_PUSH_TOOL_DETAIL_CHECK_PACKGE_FAIL })
  }
}
function* pushDetailFlow() {
  yield takeEvery(FETCH_PUSH_TOOL_DETAIL_ASYNC, fetchPushDetailAsync)
}


export default function* saga() {
  yield [
    call(pushDetailFlow)
  ]
}