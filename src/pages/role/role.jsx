import React, {Component} from 'react';

import {
  Button,
  Layout,
  Modal,
  Menu,
  message
} from 'antd';

import {reqGetRoles, reqAddRole} from '../../api';
import AddForm from './add-form';
import RoleContent from './role-content';

const {Header, Sider, Content} = Layout;
const {Item} = Menu;

export default class Role extends Component {

  state = {
    roles: [],
    role: {},
    isShowAdd: false,
  }

  getRoles = async () => {
    const result = await reqGetRoles();
    if(result.status === 0){
      const roles = result.data;
      this.setState({roles, role: roles[0]});
    }else {
      message.error(result.msg, 1);
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

  setMenuList = () => {
    const {roles} = this.state;
    const menuList = roles.map(role => (
      <Item key={role._id}>{role.name}</Item>
    ));
    return menuList;
  }

  onSelect = ({key}) => {
    const {roles} = this.state;
    const role = roles.find(role => role._id === key);
    this.setState({role});
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {

    const {isShowAdd, role} = this.state;

    const menuList = this.setMenuList();

    return (
      <Layout style={{ minHeight: '100%' }} >
        <Header style={{backgroundColor: 'white'}}>
          <span>
            <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>添加角色</Button>
          </span>
        </Header>
        <Layout style={{borderTop: '1px solid #ccc'}}>
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #ccc'}}>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              onSelect={this.onSelect}
              selectedKeys={[role._id]}
            >
              {
                menuList
              }
            </Menu>
          </Sider>
          <Content>
            <RoleContent role={role}/>
          </Content>
        </Layout>
        <Modal
          title='添加角色'
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({isShowAdd: false});
            this.form.resetFields();
          }}
        >
          <AddForm setForm={form => this.form=form}/>
        </Modal>
      </Layout>
    )
  }
}