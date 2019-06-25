import React, { Component } from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import { Spin } from 'antd';
import Loadable from 'react-loadable'

export default class PushCenter extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const Loading = () => {
      return (
        <div className="loading">
          <Spin size="large" />
        </div>
      )
    }
    return (
      <Switch>
        <Route 
          exact 
          path='/customer/push' 
          component={Loadable({
            loader: () => import(
            /* webpackChunkName: "PushCenter" */ 
              './Index/index'),
            loading: Loading
          })}
        />
        <Route 
          exact 
          path='/customer/push/new' 
          component={Loadable({
            loader: () => import(
            /* webpackChunkName: "CreatePushCenter" */ 
              './Create'),
            loading: Loading
          })}
        />
        <Route 
          exact 
          path='/customer/push/detail/:id' 
          component={Loadable({
            loader: () => import(
            /* webpackChunkName: "DetailPushCenter" */ 
              './Detail'),
            loading: Loading
          })}
        />
      </Switch>
    )
  }
}