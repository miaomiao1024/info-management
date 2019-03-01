import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout, Button, Icon } from 'antd';
import './index.css';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class LeftLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
        collapsed: false,
      
    };
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {

    return (
       <Sider width={200} className='info-sider'>
            <Button type="primary" onClick={this.toggleCollapsed} >
            <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
            >
                    <Menu.Item key="1" >
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="desktop" />
                        <span>Option 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="inbox" />
                        <span>Option 3</span>
                    </Menu.Item>
                    <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <SubMenu key="sub3" title="Submenu">
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </SubMenu>
 
            </Menu>
       </Sider>
    );
  }
}

export default LeftLayout;

