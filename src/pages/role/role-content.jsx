import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import authList from '../../config/authConfig.js';
import {reqUpdateRole} from '../../api';
import {logout} from '../../redux/actions';

import {
  Card,
  Checkbox,
  Row,
  Col,
  message,
  Button
} from 'antd';

class RoleContent extends Component {

  constructor(props) {
    super(props);

    const {menus} = props.role || [];
    this.state = {menus};
  }

  static propTypes = {
    role: PropTypes.object.isRequired
  }

  getCardMenus = (authList) => {
    const menus = this.state.menus || [];
    const cardMenus = authList.map(auth => {
      const checkBoxs = auth.children.reduce((pre, authChild) => {
        const checkbox = (
          <Col span={8} key={authChild.key}>
            <Checkbox value={authChild.key}>{authChild.title}</Checkbox>
          </Col>
        )
        pre.push(checkbox);
        return pre;
      }, []);
      const defaultValue = menus.filter(menu => menu.indexOf(auth.key) === 0);
      return (
        <Card 
          type='inner' 
          title={auth.title}
          key={auth.title}
          bordered={false}
          headStyle={{backgroundColor: 'white'}}
        >
          <Checkbox.Group 
            style={{width: '100%'}} 
            onChange={checkedList => this.handleChange(checkedList, auth.key)}
            value={defaultValue}
          >
            <Row>
              {
                checkBoxs
              }
            </Row>
          </Checkbox.Group>
        </Card>
      )
    })

    return cardMenus;
  }

  handleChange = async (checkedList, key) => {
    this.setState(state => {
      const newMenus = state.menus ? state.menus.filter(menu => menu.indexOf(key) !== 0) : [];
      return {
        menus: [...newMenus, ...checkedList]
      }
    });
  }

  handleClick = async() => {
    const role = this.props.role;
    const {menus} = this.state;
    role.menus = menus;
    role.auth_name = this.props.user.username;

    // 请求更新
    const result = await reqUpdateRole(role);
    if(result.status === 0){
      console.log(role._id, this.props.user);
      if(role._id === this.props.user.role_id){
        this.props.logout();
        message.warning('当前用户角色权限修改，请重新登录', 1);
      }else {
        message.success('设置角色权限成功', 1);
      }
    }else {
      message.error(result.msg, 1);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({menus: nextProps.role.menus});
  }

  render() {
    const {role} = this.props;
    const title = (
      <span>
        {role.name}
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.handleClick}>
        保存
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        {
          // this.cardMenus
          this.getCardMenus(authList)
        }
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(RoleContent);