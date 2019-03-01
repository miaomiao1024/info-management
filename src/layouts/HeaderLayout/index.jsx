import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Dropdown, Avatar, Icon } from 'antd';
import './index.css'
const { Header} = Layout;
class HeaderLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {

        menuList: [
            {
              id:'1',
              name:'指标百科',
              url:'/data/indicator'
            },
            {
              id:'2',
              name:'营销监控',
              url:'/data/monitor'
            },
            {
              id:'3',
              name:'报表中心',
              url:'/data/report'
            },
          ],
    }
  }

  

  render() {
    const menu = (
        <Menu className={'menu'}>
          <Menu.Item key="logout">
            <Icon type="logout" />退出登录
          </Menu.Item>
        </Menu>
      );
    
    return (
        <Header className="custom-header">
            <Link to="/"><div className={'logo'}>信息管理系统</div></Link>
            <div className={'userInfo'}>
                <Link to="./" style={{ color: 'white' }}><span>登录</span></Link>
            </div>
        </Header>
    );
  }
}

export default HeaderLayout;

