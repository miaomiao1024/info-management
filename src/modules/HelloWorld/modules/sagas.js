// import { put, takeLatest, all ,call} from 'redux-saga/effects'
// import {
//   HELLOWORLD_SET_NAME,
//   HELLOWORLD_LOAD_DATA
// } from './actionTypes';
// import { getName, getList } from '../services'


// function* setNameAsync() {
//   try{
//     const {name} = yield call(getName);
//     yield put({ type: HELLOWORLD_SET_NAME, payload: name })
//     const data = yield call(getList);
//     console.info(data)
//   } catch (error) {
//     console.error(error)
//   }
// }


// function* watchSetNameAsync() {
//   yield takeLatest(HELLOWORLD_LOAD_DATA, setNameAsync)
// }

// export default function* sagas() {
//   yield all([
//     watchSetNameAsync()
//   ])
// }
