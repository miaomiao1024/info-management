import {
    combineReducers,
  } from 'redux'
  import { all } from 'redux-saga/effects'
  import { reducers as hello } from './HelloWorld'
  import { reducers as crowdTag } from './CrowdTag'
  import { 
    reducers as pushCenterReducers,
    sagas as pushSagas  
  } from './PushCenter'
  import { reducers as common} from './Common'
  import { reducers as experiment } from './Experiment'
  import { reducers as sceneConfig } from './SceneConfig'
  export default combineReducers({
    hello,
    crowdTag,
    pushCenter: pushCenterReducers,
    common,
    experiment,
    sceneConfig
  })
    
  export function * sagas(){
    yield all([pushSagas()])
  }