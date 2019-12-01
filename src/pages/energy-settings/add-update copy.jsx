import React, {Component} from 'react';

import {
  Form,
  Input,
  Select
} from 'antd';

import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

class AddOrUpdateForm extends Component {

  static propTypes = {
    // setForm={form => this.form=form} treeNode={selectedNode} isUpdate={this.isUpdate} meters={this.meters}
    setForm: PropTypes.func.isRequired,
    treeNode: PropTypes.object.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    meters: PropTypes.array.isRequired
  }

  setOptions = () => {
    this.meterOptions = this.props.meters.reduce((pre, meter) => {
      pre.push(
        <Option key={meter._id} value={meter._id}>{meter.name}</Option>
      );
      return pre
    }, []);
  }


  UNSAFE_componentWillMount() {
    this.setOptions();
    this.props.setForm(this.props.form);
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const {isUpdate, treeNode} = this.props;

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 15}
    }
    return (
      <Form {...formItemLayout}>
        <Item label='表的名称'>
          {
            getFieldDecorator("title", {
              initialValue: isUpdate?treeNode.title: '',
              rules: [
                {required: true, message: '请输入表的名称'}
              ]
            })(
              <Input placeholder='请输入表的名称'/>
            )
          }
        </Item>
        <Item label='对应的表'>
          {
            getFieldDecorator("meterId")(
              // <Input placeholder='请关联对应的表'/>
              <Select placeholder='请关联对应的表'>
                {
                  this.meterOptions
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddOrUpdateForm);