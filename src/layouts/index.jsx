import React, { Component } from 'react';
import './index.css';
import IndexView from '../routes';
import HeaderLayout from './HeaderLayout'
import LeftLayout from './LeftLayout'

import { Link } from 'react-router-dom';
import { Menu, Layout, Dropdown, Avatar, Icon } from 'antd';
const { Header,Content, Sider} = Layout;

class View extends Component {
    
  render() {
    return (
      <div>
        <Layout className={'layout custom-layout'}>
          <HeaderLayout></HeaderLayout>
          <Layout>
            <LeftLayout></LeftLayout>
            <Content className={'content-layout'}>
              <IndexView></IndexView>
            </Content>
          </Layout>
        </Layout>
      </div>
      
    );
  }
}

export default View;