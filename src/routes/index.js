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
          path='/infomation/report' 
          component={Loadable({
            loader: () => import(
              /* webpackChunkName: "Indicator" */ 
              './Report'),
            loading: Loading
          })}
        />
        <Route 
          exact 
          path='/infomation/plan' 
          component={Loadable({
            loader: () => import(
              /* webpackChunkName: "Marketing" */ 
              './EmergencyPlan'),
            loading: Loading
          })}
        />
      
      <Route 
        exact 
        path='/infomation/work' 
        component={Loadable({
          loader: () => import(
            /* webpackChunkName: "Marketing" */ 
            './Homework'),
          loading: Loading
        })}
      />
    </Switch>
    )
  }
  
}


export default RouteView