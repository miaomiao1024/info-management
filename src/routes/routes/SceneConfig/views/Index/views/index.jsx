import React, { Component, } from 'react'
import './index.styl'
import SearchModule from './SearchModule'
import SceneList from './SceneList'
import {
  Button,
  ModuleTitle,
} from '@components'
import {
  Link,
} from 'react-router-dom'
import {
  bindActionCreators
} from 'redux'
import {
  connect,
} from 'react-redux'
import { actions } from '@modules/SceneConfig'


class SceneConfig extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  render() {

    return (
      <div className="scene-config-page">
        <ModuleTitle title="场景配置列表">
          {
            <Link to="/customer/scene/new">
              <Button
                type="primary" 
              >
                +  新增场景
              </Button>
            </Link>
          }
        </ModuleTitle>
        <SearchModule />
        <SceneList />
      </div>
    )
  }
}
export default connect(state => ({}),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }))(SceneConfig)

/* import { ComingSoon } from '@didi/fui'
import React from 'react'
import T from 'prop-types'

export default class extends React.Component{
  static defaultProps = {
    menus: [],
  }
  static propTypes = {
    menus: T.array,
    match: T.object.isRequired,
  }
  render(){
    const { menus, match:{ url }} = this.props
    let menuName = ''
    for(const {children} of menus){
      for(const { url: menuUrl, name }  of children){
        if( menuUrl === url ){
          menuName = name
          break;
        }
      }
    }
    return (
      <ComingSoon
        title={ menuName }
        desc="场景配置马上要上线了，敬请期待！"
      />
    )
  }
} */

