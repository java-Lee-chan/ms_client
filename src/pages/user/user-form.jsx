import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Form, 
  Input,
  Select
} from 'antd';

const Item = Form.Item;
const Option = Select.Option;

class UserForm extends Component {

  static propTypes = {
    roles: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const user = this.props.user || {};

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 15}
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名:'>
          {
            getFieldDecorator("username", {
              initialValue: user.username,
              rules: [
                {required: true, message: '用户名必须输入'},
                {min: 4, message: '用户名不能少于4位'},
                {max: 12, message: '用户名不能大于12位'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由英文、数字或下划线组成'}
              ]
            })(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        {
          user._id? null : (
            <Item label='密码:'>
              {
                getFieldDecorator("password", {
                  rules: [
                    {required: true, message: '密码必须输入'},
                    {min: 4, message: '密码不能少于4位'},
                    {max: 12, message: '密码不能大于12位'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须由英文、数字或下划线组成'}
                  ]
                })(
                  <Input type='password' placeholder='请输入密码'/>
                )
              }
            </Item>
          )
        }
        <Item label='邮箱:'>
          {
            getFieldDecorator("email", {
              initialValue: user.email,
              rules: [
                {required: true, message: '邮箱必须输入'},
                { pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, message: '请输入正确的邮箱'}
              ]
            })(
              <Input type='email' placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='电话:'>
          {
            getFieldDecorator("phone", {
              initialValue: user.phone,
              rules: [
                {required: true, message: '手机号必须输入'},
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号'}
              ]
            })(
              <Input />
            )
          }
        </Item>
        <Item label='所属角色:'>
          {
            getFieldDecorator("role_id", {
              initialValue: user.role_id,
              rules: [
                {required: true, message: '角色必须选择'},
              ]
            })(
              <Select placeholder='请选择角色'>
                {
                  this.props.roles.map(role => (
                    <Option key={role._id} value={role._id}>{role.name}</Option>
                  ))
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm);