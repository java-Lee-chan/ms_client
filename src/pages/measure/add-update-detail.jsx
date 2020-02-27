import React, {Component} from 'react';

import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  DatePicker,
  Select,
  message,
  ConfigProvider,
  Row,
  Col
} from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import moment from 'moment';

import LinkButton from '../../components/link-button/link-button';
import {reqAddMeasure, reqUpdateMeasure, reqCheckId} from '../../api';
import MemoryUtils from '../../utils/memoryUtils';

const Item = Form.Item;
const Option = Select.Option

class MeasureAddUpdateAndDetail extends Component{

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
      if(duration !== '长期'){
        const next_time = moment(dateString, 'YYYY/MM/DD').add(parseInt(duration), 'M').subtract(1, 'd');
        this.props.form.setFieldsValue({'next_time': next_time});
      }else {
        this.props.form.setFieldsValue({'next_time': null});
      }
    }
  }

  handleDurationChange = (value) => {
    const {last_time} = this.state;
    this.setState({duration: value});
    if(last_time){
      if(value !== '长期'){
        const next_time = moment(last_time, 'YYYY/MM/DD').add(parseInt(value), 'M').subtract(1, 'd');
        this.props.form.setFieldsValue({'next_time': next_time});
      }else {
        this.props.form.setFieldsValue({'next_time': null});
      }
    }
  }

  handleSubmit = (event) => {
    const {isUpdate} = this;
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if(!err){
        const measure = values;
        measure.last_time = values.last_time.format('YYYY/MM/DD');
        measure.next_time = values.duration === '长期'? '-' : values.next_time.format('YYYY/MM/DD');
        measure.duration = values.duration;
        if(!isUpdate){
          const result = await reqAddMeasure(measure);
          if(result.status === 0){
            message.success('添加测量仪器成功', 1);
            this.props.form.resetFields();
            MemoryUtils.measure = {};
            this.props.history.replace('/measure');
          }else {
            message.error(result.msg, 1);
          }
        }else {
          const result = await reqUpdateMeasure(measure);
          if(result.status === 0){
            message.success('更新测量仪器成功', 1);
            this.props.form.resetFields();
            MemoryUtils.measure = {};
            this.props.history.replace('/measure');
          }else {
            message.error(result.msg, 1);
          }
        }
      }else {
        message.error(isUpdate?'更新失败':'添加失败', 1);
      }
    })
  }

  // 添加时判断计量编号是否重复
  validateId = async (rule, value, callback) => {
    // 发送后台请求计量编号是否重复
    const result = await reqCheckId(value);
    if(result.status === 0 || this.isUpdate){
      callback();
    }else {
      callback(result.msg);
    }
  }

  // 将要挂载界面前判断是编辑还是查看还是添加，并得到该测量仪器
  UNSAFE_componentWillMount() {
    const measure = MemoryUtils.measure;
    this.isUpdate = !!measure._id;
    this.measure = measure || {};
    if(this.isUpdate) {
      this.setState({
        last_time: measure.last_time,
        duration: measure.duration,
      })
    }
    if(this.props.location.state){
      const measureDetail = this.props.location.state.measure || {};
      this.isDetail = !!measureDetail._id;
      this.measureDetail = measureDetail ;
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const {measure, isUpdate, isDetail, measureDetail} = this;

    const next_time_initial = isUpdate? (measure.duration === '长期'? null:moment(measure.next_time, 'YYYY/MM/DD')): (isDetail? (measureDetail.duration === '长期'? null:moment(measureDetail.next_time, 'YYYY/MM/DD')): null);

    const next_time_placeholder = (isUpdate && measure.duration === '长期') || (isDetail && measureDetail.duration === '长期') || this.props.form.getFieldValue('duration') === '长期' ?'-' : '请选择日期';
    
    const formItemLayout = {
      labelCol: { 
        md: {span: 6},
        sm: {span: 8}
      },
      wrapperCol: { 
        md: {span: 14},
        sm: {span: 12}
      }
    };

    const title = (
      <span>
        <LinkButton style={{fontSize: 20}} 
          onClick={()=> {
            this.props.history.goBack();
            this.isUpdate = false;
            MemoryUtils.measure = {};
            this.props.form.resetFields();
        }}>
          <Icon type='arrow-left'/>
        </LinkButton>
        <span>{isUpdate? '编辑计量仪器':(isDetail? '查看计量仪器': '添加计量仪器')}</span>
      </span>
    );
    
    return (
      <ConfigProvider locale={zhCN}>
        <Card title={title}>
          <Form 
            {...formItemLayout}
            onSubmit={this.handleSubmit}
          >
            <Row>
              <Col md={12} sm={24}>
                <Item label='计量编号:'>
                  {
                    getFieldDecorator("_id", {
                      initialValue: isUpdate? measure._id: (isDetail? measureDetail._id: ''),
                      rules: [
                        {required: true, message: '请输入计量编号'},
                        {validator: this.validateId}
                      ]
                    })(
                      <Input disabled={isUpdate || isDetail}/>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='器具名称:'>
                  {
                    getFieldDecorator("name", {
                      initialValue: isUpdate? measure.name: (isDetail? measureDetail.name: ''),
                      rules: [
                        {required: true, message: '请输入器具名称'}
                      ]
                    })(
                      <Input disabled={isDetail}/>
                    )
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='规格型号:'>
                  {
                    getFieldDecorator('model', {
                      initialValue: isUpdate? measure.model: (isDetail? measureDetail.model: ''),
                    })(
                      <Input disabled={isDetail}/>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='出厂编号:'>
                  {
                    getFieldDecorator('factory_num', {
                      initialValue: isUpdate? measure.factory_num: (isDetail? measureDetail.factory_num: ''),
                    })(
                      <Input disabled={isDetail}/>
                    )
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='制造商:'>
                  {
                    getFieldDecorator('manufacturer', {
                      initialValue: isUpdate? measure.manufacturer: (isDetail? measureDetail.manufacturer: ''),
                    })(
                      <Input disabled={isDetail} />
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='检定日期:'>
                  {
                    getFieldDecorator('last_time', {
                      initialValue: isUpdate? moment(measure.last_time, 'YYYY/MM/DD'):  (isDetail? moment(measureDetail.last_time, 'YYYY/MM/DD'): null),
                      rules: [
                        {required: true, message: '请选择上次检定时间!' }
                      ]
                    })(<DatePicker onChange={this.handleLastTimeChange} disabled={isDetail}/>)
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='检定周期:'>
                  {
                    getFieldDecorator('duration', {
                      initialValue: isUpdate? measure.duration: (isDetail? measureDetail.duration: ''),
                    })(
                      <Select onChange={this.handleDurationChange} disabled={isDetail}>
                        <Option value='3个月'>3个月</Option>
                        <Option value='6个月'>6个月</Option>
                        <Option value='12个月'>12个月</Option>
                        <Option value='长期'>长期</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='有效期至:'>
                  {
                    getFieldDecorator('next_time', {
                      initialValue: next_time_initial,
                    })(<DatePicker disabled placeholder={next_time_placeholder}/>)
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='ABC管理:'>
                  {
                    getFieldDecorator('abc',{
                      initialValue: isUpdate? measure.abc: (isDetail? measureDetail.abc: 'A')
                    })(
                      <Select disabled={isDetail}>
                        <Option value='A'>A</Option>
                        <Option value='B'>B</Option>
                        <Option value='C'>C</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='检定结果:'>
                  {
                    getFieldDecorator('result', {
                      initialValue: isUpdate? measure.result: (isDetail? measureDetail.result: '合格')
                    })(
                      <Select disabled={isDetail}>
                        <Option value='合格'>合格</Option>
                        <Option value='不合格'>不合格</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='使用地点:'>
                  {
                    getFieldDecorator('location', {
                      rules: [
                        {required: true, message: '请输入使用地点'}
                      ],
                      initialValue: isUpdate? measure.location: (isDetail? measureDetail.location: 'INJ')
                    })(
                      <Select disabled={isDetail}>
                        <Option value='INJ'>INJ</Option>
                        <Option value='BPR'>BPR</Option>
                        <Option value='INP'>INP</Option>
                        <Option value='保全系'>保全系</Option>
                        <Option value='品质系'>品质系</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='用途:'>
                  {
                    getFieldDecorator('usage', {
                      initialValue: isUpdate? measure.usage: (isDetail? measureDetail.usage: '')
                    })(
                      <Input disabled={isDetail}/>
                    )
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={24}>
                <Item label='送检类型:'>
                  {
                    getFieldDecorator('type', {
                      initialValue: isUpdate? measure.type: (isDetail? measureDetail.type: '校准')
                    })(
                      <Select disabled={isDetail}>
                        <Option value='校准'>校准</Option>
                        <Option value='检定'>检定</Option>
                        <Option value='送检'>送检</Option>
                        <Option value='现场检定'>现场检定</Option>
                        <Option value='自立化检定'>自立化检定</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
              <Col md={12} sm={24}>
                <Item label='状态:'>
                  {
                    getFieldDecorator('status', {
                      initialValue: isUpdate? measure.status: (isDetail? measureDetail.status: '在库')
                    })(
                      <Select disabled={isDetail}>
                        <Option value='在库'>在库</Option>
                        <Option value='送检'>送检</Option>
                        <Option value='维修'>维修</Option>
                        <Option value='新增'>新增</Option>
                      </Select>
                    )
                  }
                </Item>
              </Col>
            </Row>
            <Row>
              <Col offset={20}>
                {
                isDetail? '': (
                  <Item>
                    <Button type='primary' htmlType='submit'>提交</Button>
                  </Item>
                )
              }
              </Col>
            </Row>
          </Form>
        </Card>
      </ConfigProvider>
    )
  }
}

export default Form.create()(MeasureAddUpdateAndDetail);