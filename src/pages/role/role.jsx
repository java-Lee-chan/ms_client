import React, {Component} from 'react';

import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd';

import {connect} from 'react-redux';
import {logout} from '../../redux/actions';
import {reqGetRoles, reqAddRole, reqUpdateRole} from '../../api';
import {formatDate} from '../../utils/dateUtils';
import AddForm from './add-form';
import AuthForm from './auth-form';

class Role extends Component {

  state = {
    roles: [],
    role: {},
    isShowAdd: false,
    isShowAuth: false
  }

  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formatDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  getRoles = async () => {
    const result = await reqGetRoles();
    if(result.status === 0){
      const roles = result.data;
      this.setState({roles});
    }else {
      message.error(result.msg, 1);
    }
  }
  
  onRow = (role) => {
    return {
      onClick: () => {
        this.setState({
          role: this.state.role === role ? {} : role
        });
      }
    }
  }

  addRole = () => {
    this.form.validateFields(async (err, values) => {
      if(!err) {
        const {roleName} = values;
        this.form.resetFields();
        const result = await reqAddRole(roleName);
        if(result.status === 0){
          message.success('添加角色成功', 1);
          const role = result.data;
          this.setState(state => ({
            isShowAdd: false,
            roles: [...state.roles, role]
          }));
        }else {
          message.error(result.msg, 1);
        }
      }
    })
  }

  updateRole = async() => {
    const role = this.state.role;

    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = this.props.user.username;

    // 请求更新
    const result = await reqUpdateRole(role);
    if(result.status === 0){
      if(role._id === this.props.user.role_id){
        this.props.logout();
        message.warning('当前用户角色权限修改，请重新登录', 1);
      }else {
        message.success('设置角色权限成功', 1);
        this.getRoles();
        this.setState({
          isShowAuth: false,
        });
      }
    }else {
      message.error(result.msg, 1);
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const {roles, role, isShowAdd, isShowAuth} = this.state;

    const title = (
      <span>
        <Button type='primary' onClick={() => {this.setState({isShowAdd: true})}}>创建角色</Button>&nbsp;&nbsp;
        <Button
          type='primary'
          disabled={!role._id}
          onClick={() => {this.setState({isShowAuth: true});}}
        >
          设置角色权限
        </Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({role});
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false});
            this.form.resetFields();
          }}
        >
          <AddForm setForm={(form) => {this.form = form}}/>
        </Modal>
        <Modal
          title='设置角色权限'
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({isShowAuth: false});
          }}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role);