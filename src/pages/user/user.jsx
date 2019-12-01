import React, {Component} from 'react';
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal
} from 'antd';

import {connect} from 'react-redux';
import {logout} from '../../redux/actions';
import {reqGetUsers, reqAddOrUpdate, reqDeleteUser} from '../../api';
import {formatDate} from '../../utils/dateUtils';
import LinkButton from '../../components/link-button/link-button';
import UserForm from './user-form';

class User extends Component {
  state = {
    users: [],
    roles: [],
    isShow: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '序号',
        key: '_id',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ]
  }

  getUsers = async () => {
    const result = await reqGetUsers();
    if(result.status === 0){
      const {users, roles} = result.data;
      this.initRoleNames(roles);
      this.setState({users, roles});
    }else {
      message.error(result.msg, 1);
    }
  }
  
  showUpdate = (user) => {
    this.setState({
      isShow: true
    });
    this.user = user;
  }

  deleteUser = (user) => {
    Modal.confirm({
      title: `确定删除${user.username}吗`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if(result.status === 0){
          if(user._id === this.props.user._id){
            message.success('当前用户被删除请重新登录', 1);
            this.props.logout();
          }else {
            message.success('删除用户成功', 1);
            this.getUsers();
          }
        }else {
          message.error(result.msg, 1);
        }
      }
    })
  }

  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre
    }, {});
    this.roleNames = roleNames;
  }

  showAdd = () => {
    this.setState({isShow: true});
    this.user = null;
  }

  addOrUpdateUser = () => {
    this.form.validateFields(async (err, values) => {
      if(!err){
        const user = values;
        this.form.resetFields();
        if(this.user && this.user._id){
          user._id = this.user._id;
        }
        const result = await reqAddOrUpdate(user);
        if(result.status === 0){
          // 3. 更新列表显示
          if(this.user && this.user._id && this.user._id === this.props.user._id){
            message.success(`修改当前用户的信息后需重新登录`, 1);
            this.props.logout();
          }else {
            message.success(`${this.user?'修改':'添加'}用户成功`, 1);
            this.getUsers();
            this.setState({
              isShow: false
            });
          }
        }else {
          message.error(result.msg, 1);
        }
      }
    })
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getUsers();
  }
  render() {
    const {users, roles, isShow} = this.state;

    const title = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        创建用户
      </Button>
    );

    return (
      <Card 
        title={title}
      >
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
        />
        <Modal
          title={this.user? '修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({isShow: false});
            this.form.resetFields();
          }}
        >
          <UserForm setForm={(form) => this.form=form} user={this.user} roles={roles}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(User);