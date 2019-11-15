import React, {Component} from 'react';

import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  DatePicker,
  Select,
  message
} from 'antd';

import moment from 'moment';

import LinkButton from '../../components/link-button/link-button';
import MemoryUtils from '../../utils/memoryUtils';

const Item = Form.Item;
const Option = Select.Option

class MeasureAddUpdate extends Component{

  state = {
    last_time: '',
    duration: '',
  }

  handleLastTimeChange = (date, dateString) => {
    const {duration} = this.state;
    this.setState({last_time: dateString});
    // 为什么要用dateString，因为如果直接用date，date是个moment对象，会导致last_time和next_time两个moment绑定从而一起变化
    // 只能通过dateString创造一个新的moment
    if(duration && date){
      const next_time = moment(dateString, 'YYYY-MM-DD').add(parseInt(duration), 'M');
      this.props.form.setFieldsValue({'next_time':next_time});
    }
  }

  handleDurationChange = (value) => {
    const {last_time} = this.state;
    this.setState({duration: value});
    if(last_time){
      const next_time = moment(last_time, 'YYYY-MM-DD').add(parseInt(value), 'M');
      this.props.form.setFieldsValue({'next_time':next_time});
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        
      }else {
        message.error('添加失败', 1);
      }
    })
  }

  validateNum = (rule, value, callback) => {
    // 发送后台请求计量编号是否重复
    callback();
  }

  componentWillMount() {
    const measure = MemoryUtils.measure;
    this.isUpdate = !!measure.num;
    this.measure = measure || {};
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const {measure} = this;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };

    const title = (
      <span>
        <LinkButton style={{fontSize: 20}} onClick={()=> this.props.history.goBack()}>
          <Icon type='arrow-left'/>
        </LinkButton>
        <span>{(measure && measure.num)? '编辑计量仪器':'添加计量仪器'}</span>
      </span>
    );
    
    return (
      <Card title={title}>
        <Form 
          {...formItemLayout}
          onSubmit={this.handleSubmit}
        >
          <Item label='计量编号:'>
            {
              getFieldDecorator("num", {
                rules: [
                  {required: true, message: '请输入计量编号'},
                  {validator: this.validateNum}
                ]
              })(
                <Input />
              )
            }
          </Item>
          <Item label='器具名称:'>
            {
              getFieldDecorator("name", {
                rules: [
                  {required: true, message: '请输入器具名称'}
                ]
              })(
                <Input />
              )
            }
          </Item>
          <Item label='规格型号:'>
            <Input/>
          </Item>
          <Item label='出厂编号:'>
            <Input/>
          </Item>
          <Item label='制造商:'>
            <Input/>
          </Item>
          <Item label='检定日期:'>
            {
              getFieldDecorator('last_time', {
                rules: [
                  {required: true, message: '请选择上次检定时间!' }
                ]
              })(<DatePicker onChange={this.handleLastTimeChange}/>)
            }
          </Item>
          <Item label='检定周期:'>
            {
              getFieldDecorator('duration')(
                <Select onChange={this.handleDurationChange}>
                  <Option value='3'>3个月</Option>
                  <Option value='6'>6个月</Option>
                  <Option value='12'>12个月</Option>
                </Select>
              )
            }
          </Item>
          <Item label='有效期至:'>
            {
              getFieldDecorator('next_time', {
              })(<DatePicker disabled/>)
            }
          </Item>
          <Item label='ABC管理:'>
            {
              getFieldDecorator('abc',{
                initialValue: 'A'
              })(
                <Select>
                  <Option value='A'>A</Option>
                  <Option value='B'>B</Option>
                  <Option value='C'>C</Option>
                </Select>
              )
            }
          </Item>
          <Item label='检定结果:'>
            {
              getFieldDecorator('result', {
                initialValue: '合格'
              })(
                <Select>
                  <Option value='合格'>合格</Option>
                  <Option value='不合格'>不合格</Option>
                </Select>
              )
            }
          </Item>
          <Item label='使用地点:'>
            {
              getFieldDecorator('location', {
                initialValue: 'INJ'
              })(
                <Select>
                  <Option value='INJ'>INJ</Option>
                  <Option value='BPR'>BPR</Option>
                  <Option value='INP'>INP</Option>
                </Select>
              )
            }
          </Item>
          <Item label='用途:'>
            <Input/>
          </Item>
          <Item label='送检类型:'>
            {
              getFieldDecorator('type', {
                initialValue: '校准'
              })(
                <Select>
                  <Option value='校准'>校准</Option>
                  <Option value='检定'>检定</Option>
                </Select>
              )
            }
          </Item>
          <Item label='状态:'>
            {
              getFieldDecorator('status', {
                initialValue: '在库'
              })(
                <Select>
                  <Option value='在库'>在库</Option>
                  <Option value='送检'>送检</Option>
                </Select>
              )
            }
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(MeasureAddUpdate);