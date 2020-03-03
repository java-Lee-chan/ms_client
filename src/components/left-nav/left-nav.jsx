import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu, Icon } from 'antd';

import {setHeadTitle} from '../../redux/actions';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menuConfig';

import './left-nav.less'

const { SubMenu } = Menu;

class LeftNav extends Component {

  static propTypes = {
    setHeadTitle: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired
  }

  // 根据导航的配置文件配置导航
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    
    return menuList.map(item => {
      if(!item.children){
        if(path === item.key || path.indexOf(item.key) === 0){
          this.props.setHeadTitle(item.title);
        }
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key} onClick={() => {this.props.setHeadTitle(item.title)}}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
        if(cItem) {
          this.openKey = item.key;
        }
        return (
          <SubMenu key={item.key} title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }
  
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }

  render() {
    let path = this.props.location.pathname;
    if(path.indexOf('/measure') === 0){
      path = '/measure';
    }
    if(path.indexOf('/spare-part') === 0){
      path = '/spare-part';
    }
    if(path.indexOf('/energy/settings') === 0){
      path = '/energy/settings';
    }
    const openKey = this.openKey;

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          {
            this.props.collapsed ? <img src={logo} className="collapsedLogo" alt="logo"/> : 
            (
              <>
                <img src={logo} className="uncollapsedLogo" alt="logo"/>
                <h1>后台管理系统</h1>
              </>
            )
          }
          
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  {setHeadTitle}
)(withRouter(LeftNav));