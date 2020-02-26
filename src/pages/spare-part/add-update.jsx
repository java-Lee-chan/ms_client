import React, {Component} from 'react';

import {
  Card, 
  Form,
  Input, 
  Icon,
  Button,
  InputNumber,
  message,
  Row,
  Col
} from 'antd';

import {connect} from 'react-redux';

import moment from 'moment';

import LinkButton from '../../components/link-button/link-button';
import {reqAddSparePart, reqUpdateSparePart} from '../../api';

const Item = Form.Item;

class SparePartAddUpdate extends Component {

  state = {
    price: 0,
    num: 0,
  }

  handleChange = (value, type) => {
    if(type === 'price') {
      this.setState({price: value}, () => {
        const {price, num} = this.state;
        if(price * num > 0) {
          this.props.form.setFieldsValue({'total': price * num});
        }else {
          this.props.form.setFieldsValue({'total': 0});
        }
      });
    }else {
      this.setState({num: value}, () => {
        const {price, num} = this.state;
        if(price * num > 0) {
          this.props.form.setFieldsValue({'total': price * num});
        }else {
          this.props.form.setFieldsValue({'total': 0});
        }
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      if(!err) {
        const sparePart = values;
        sparePart.committer = this.props.user.username;
        sparePart.time = moment().format('YYYY/MM/DD');
        sparePart.status = '未确认';
        if(this.isUpdate) {
          sparePart._id = this.sparePart._id;
          const result = await reqUpdateSparePart(sparePart);
          if(result.status === 0){
            message.success('编辑备件成功', 1);
            this.props.form.resetFields();
            this.props.history.replace('/spare-part');
          }else {
            message.error(result.msg, 1);
          }
        }else {
          const result = await reqAddSparePart(sparePart);
          if(result.status === 0){
            message.success('申购备件成功', 1);
            this.props.form.resetFields();
            this.props.history.replace('/spare-part');
          }else {
            message.error(result.msg, 1);
          }
        }
      }
    })
  }

  UNSAFE_componentWillMount() {
    if(this.props.location.state){
      const sparePart = this.props.location.state.sparePart || {};
      this.isUpdate = !!sparePart._id;
      this.sparePart = sparePart;
      if(this.isUpdate){
        this.setState({price: sparePart.price, num: sparePart.num});
      }
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    const {sparePart, isUpdate} = this;

    const title = (
      <span>
        <LinkButton style={{fontSize: 20}} 
          onClick={()=> {
            this.props.history.goBack();
            // this.isUpdate = false;
            // MemoryUtils.measure = {};
            this.props.form.resetFields();
        }}>
          <Icon type='arrow-left'/>
        </LinkButton>
        <span>{'申购备件'}</span>
      </span>
    );

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 }
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
              <Item label='备件名称'>
                {
                  getFieldDecorator('name', {
                    initialValue: isUpdate? sparePart.name: '',
                    rules: [
                      {required: true, message: '请输入备件名称'},
                    ]
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
            <Col span={12}>
              <Item label='型号'>
                {
                  getFieldDecorator('model', {
                    initialValue: isUpdate? sparePart.model: '',
                    rules: [
                      {required: true, message: '请输入备件型号'},
                    ]
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item label='规格'>
                {
                  getFieldDecorator('specs', {
                    initialValue: isUpdate? sparePart.specs: '',
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
            <Col span={12}>
              <Item label='品牌'>
                {
                  getFieldDecorator('brand', {
                    initialValue: isUpdate? sparePart.brand: '',
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item label='单价'>
                {
                  getFieldDecorator('price', {
                    initialValue: isUpdate? sparePart.price: 0,
                    rules: [
                      {required: true, message: '请输入备件单价'},
                    ]
                  })(
                    <InputNumber min={0} onChange={(value) => {this.handleChange(value, 'price')}}/>
                  )
                }
              </Item>
            </Col>
            <Col span={12}>
              <Item label='数量'>
                {
                  getFieldDecorator('num', {
                    initialValue: isUpdate? sparePart.num: 0,
                    rules: [
                      {required: true, message: '请输入采购数量'},
                    ]
                  })(
                    <InputNumber min={0} onChange={(value) => {this.handleChange(value, 'num')}}/>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item label='单位'>
                {
                  getFieldDecorator('unit', {
                    initialValue: isUpdate? sparePart.unit: '',
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
            <Col span={12}>
              <Item label='总价'>
                {
                  getFieldDecorator('total', {
                    initialValue: isUpdate? sparePart.total: 0,
                  })(
                    <InputNumber disabled/>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item label='用途'>
                {
                  getFieldDecorator('usage', {
                    initialValue: isUpdate? sparePart.usage: '',
                  })(
                    <Input/>
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col offset={20}>
              <Item>
                <Button type='primary' htmlType='submit'>提交</Button>
              </Item>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)(Form.create()(SparePartAddUpdate));