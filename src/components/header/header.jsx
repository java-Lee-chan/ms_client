import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Modal} from 'antd';

import {logout} from '../../redux/actions';
import LinkButton from '../link-button/link-button';
import './header.less';

class Header extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    headTitle: PropTypes.string.isRequired,
  }

  logout = () => {
    Modal.confirm({
      content: '确认退出吗',
      onOk: () => {
        this.props.logout();
      }
    });
  }

  render() {

    const {username} = this.props.user;
    const title = this.props.headTitle;

    return (
      <div className='header'>
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>时间</span>
            <img src="" alt=""/>
            <span>天气</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user, headTitle: state.headTitle}),
  {logout}
)(Header);
