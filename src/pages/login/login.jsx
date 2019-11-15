/* 
登录的路由组件
*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Redirect} from 'react-router-dom';

import {
  Form,
  Icon,
  Input,
  Button,
  message
} from 'antd';

import {login} from '../../redux/actions';

import './login.less';
import logo from '../../assets/images/logo.png'

const Item = Form.Item;

class Login extends Component {

  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func.isRequired
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if(!err) {
        // console.log(values);
        const {username, password} = values; 
        this.props.login(username, password).then(() => {
          const msg = this.props.user.msg;
          if(msg) {
            message.error(msg, 1);
          }
        });
      }else {
        message.error('校验失败', 1);
      }
    })
  }

  validatePwd = (rule, value, callback) => {
    if(!value){
      callback('密码必须输入');
    }else if(value.length<4){
      callback('密码不能少于4位');
    }else if(value.length>12){
      callback('密码不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须由英文、数字或下划线组成');
    }else {
      callback();
    }
  }
  
  render() {
    const {user} = this.props;
    if(user && user._id){
      return <Redirect to='/'/>
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                getFieldDecorator('username', {
                  rules: [
                    {required: true, whitespace: true, message: '用户名必须输入'},
                    {min: 4, message: '用户名不能少于4位'},
                    {max: 12, message: '用户名不能大于12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由英文、数字或下划线组成'}
                  ],
                  initialValue: 'admin'
                })(
                  <Input 
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='请输入用户名'/>
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    type='password'
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='请输入密码'/>
                )
              }
            </Item>
            <Item>
              <Button type='primary' htmlType='submit' className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

const WrapperLogin = Form.create()(Login);
export default connect(
  state => ({user: state.user}),
  {login}
)(WrapperLogin);