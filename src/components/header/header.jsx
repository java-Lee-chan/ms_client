import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Modal} from 'antd';

import {logout} from '../../redux/actions';
import LinkButton from '../link-button/link-button';
import {formatDate} from '../../utils/dateUtils';
import {reqWeather}from '../../api';

import './header.less';

class Header extends Component {

  state = {
    currentTime: formatDate(Date.now()),  // 当前时间字符串
    dayPictureUrl: '',  // 天气图片url
    weather: '',  // 天气的文本
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    headTitle: PropTypes.string.isRequired,
  }

  getTime = () => {
    // 每个1s获取当前时间，并更新状态数据currenTime
    this.intervalId = setInterval(() => {
      const currentTime = formatDate(Date.now());
      this.setState({currentTime});
    }, 1000);
  }

  getWeather = async () => {
    // 调用接口请求异步获取数据
    const { dayPictureUrl, weather } = await reqWeather('杭州');
    this.setState({dayPictureUrl, weather});
  }

  // 退出登录
  logout = () => {
    Modal.confirm({
      content: '确认退出吗',
      onOk: () => {
        this.props.logout();
      }
    });
  }

  /* 
  第一次render()之后执行一次
  一般在此执行异步操作：发ajax请求/启动定时器
  */
  componentDidMount() {
    // 获取当前的事件
    this.getTime();
    // 获取当前天气
    this.getWeather();
  }

  /* 
  当前组件卸载之前调用
  */
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.intervalId);
  }

  render() {
    const {currentTime, dayPictureUrl, weather} = this.state;
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
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
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
