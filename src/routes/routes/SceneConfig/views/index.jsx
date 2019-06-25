import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Spin } from 'antd'
import Loadable from 'react-loadable'

const Loading = () => {
  return (
    <div className="loading">
      <Spin size="default" />
    </div>
  )
}
export default function(){
  return (
    <Switch>
      <Route 
        exact 
        path='/customer/scene'
        component={Loadable({
          loader: () => import(
            /* webpackChunkName: "SceneConfigIndex" */ 
            './Index/'),
          loading: Loading
        })}
      />
      <Route 
        exact 
        path='/customer/scene/new' 
        component={Loadable({
          loader: () => import(
            /* webpackChunkName: "SceneConfigCreate" */ 
            './Create/'),
          loading: Loading
        })}
      />
      <Route 
        exact 
        path='/customer/scene/detail/:id' 
        component={Loadable({
          loader: () => import(
            /* webpackChunkName: "SceneConfigDetail" */ 
            './Detail/'),
          loading: Loading
        })}
      />
    </Switch>
  )
}
