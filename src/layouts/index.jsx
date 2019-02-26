import React, { Component } from 'react';
import { Menu, Icon, Button } from 'antd';
import './index.css';
const SubMenu = Menu.SubMenu;

class View extends Component {
    state = {
        collapsed: false,
      }
      toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }
  render() {
    return (
        <div className="app-nav">
           <div style={{ width: 240 }}>
                <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <Menu
                    defaultSelectedKeys={['2']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                <Menu.Item key="2">
                    <Icon type="pie-chart" />
                    <span>设备信息</span>
                </Menu.Item>
                <Menu.Item key="5">
                    <Icon type="pie-chart" />
                    <span>应急预案</span>
                </Menu.Item>
                </Menu>
            </div>
        </div>
    );
  }
}

export default View;