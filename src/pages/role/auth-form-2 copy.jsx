import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';
import PropTypes from 'prop-types';
import authList from '../../config/authConfig';

const Item = Form.Item;
const {TreeNode} = Tree;

export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    const {menus} = props.role;
    this.state = {
      checkedKeys: menus
    }
  }

  getMenus = () => this.state.checkedKeys;

  getTreeNodes = (authList) => {
    return authList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre;
    }, []);
  }

  onCheck = checkedKeys => {
    this.setState({checkedKeys});
  }

  UNSAFE_componentWillMount() {
    this.treeNodes = this.getTreeNodes(authList);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {menus} = nextProps.role;
    this.setState({
      checkedKeys: menus
    });
  }

  render() {
    const {role} = this.props;
    const {checkedKeys} = this.state;
    return (
      <>
        <Item label='角色名称' labelCol={{span: 4}} wrapperCol={{span: 15}}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title='平台权限' key='all'>
            {
              this.treeNodes
            }
          </TreeNode>
        </Tree>
      </>
    )
  }
}