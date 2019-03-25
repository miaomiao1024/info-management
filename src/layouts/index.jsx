import React, { Component } from 'react'
import './index.styl'
import IndexView from '../routes'
import HeaderLayout from './HeaderLayout'
import { Layout, } from 'antd';
const { Content, } = Layout;

class View extends Component {
    
  render() {
    return (
      <Layout className={'layout custom-layout'}>
        <HeaderLayout/>
        <Content className={'content-layout'}>
          <IndexView/>
        </Content>
      </Layout>
    );
  }
}

export default View