import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import Loadable from 'react-loadable'

const Loading = () => {
  return (
    <div className="loading">
      <Spin size="large" />
    </div>
  )
}
class RouteView extends Component{
  componentDidMount(){
    
  }
  render(){
    return (
      <Switch>
        <Route 
          exact 
          path='/information/device' 
          component={Loadable({
            loader: () => import(
              /* webpackChunkName: "Indicator" */ 
              './DeviceInformation'),
            loading: Loading
          })}
        />
        <Route 
          exact 
          path='/information/emergency' 
          component={Loadable({
            loader: () => import(
              /* webpackChunkName: "Marketing" */ 
              './EmergencyPlan'),
            loading: Loading
          })}
        />
      </Switch>
    )
  }
  
}


export default RouteView