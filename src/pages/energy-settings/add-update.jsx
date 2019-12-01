import React, {Component} from 'react';

import {
  Form,
  Input,
  Select,
} from 'antd';

import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class AddOrUpdateForm extends Component {

  static = {
    setForm: PropTypes.func.isRequired,
    meters: PropTypes.array.isRequired,
    method: PropTypes.string.isRequired,
    meterLevel: PropTypes.object
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

    const meterLevel = this.props.method === 'update'? (this.props.meterLevel): {};

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 12}
    }
    return (
      <Form {...formItemLayout}>
        <Item label='表层级名称'>
          {
            getFieldDecorator("name", {
              initialValue: meterLevel.name,
              rules: [
                {required: true, message: '请输入表的层级名称'}
              ]
            })(
              <Input placeholder='请输入表的层级名称'/>
            )
          }
        </Item>
        <Item label='对应的表'>
          {
            getFieldDecorator("meterId", {
              initialValue: meterLevel.meterId,
            })(
              <Select placeholder='请关联对应的表'>
                {
                  this.meterOptions
                }
              </Select>
            )
          }
        </Item>
        <Item label='备注'>
          {
            getFieldDecorator("remark", {
              initialValue: meterLevel.remark,
            })(
              <TextArea  placeholder='请输入备注'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddOrUpdateForm);