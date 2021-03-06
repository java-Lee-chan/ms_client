import React, {Component} from 'react';

import {
  Table,
  Dropdown,
  Menu,
  Icon,
  Modal,
  message
} from 'antd';

// import { connect } from 'react-redux';

// import {asyncGetMeterLevels, asyncAddMeterLevels, asyncUpdateMeterLevels, asyncDeleteMeterLevels} from '../../redux/actions';

import {reqGetMeterLevel, reqAddMeterLevel, reqUpdateMeterLevel, reqDeleteMeterLevel} from '../../api';
import LinkButton from '../../components/link-button/link-button';
import { translateDataToTree } from '../../utils/translateDataToTree';

import MeterForm from './add-update';

export default class Settings extends Component {

  state = {
    /* 
    meterLevels: {
      gas: [],
      water: [],
      elec: []
    }
    */
    meterLevels: {},
    isShow: false,
    method: '',
    expandedRowKeys: {},
  }

  initColumns = () => {
    this.columns = [
      {
        title: '表层级',
        dataIndex: 'name',
        width: '20%'
      },
      {
        title: '对应表',
        dataIndex: 'relateMeter',
        width: '12%',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: '30%',
      },
      {
        title: '操作',
        width: '30%',
        render: (record) => (
          <span>
            <LinkButton disabled={record.father_id?false:true} onClick={() => this.handleMethod(record, 'update')}>编辑</LinkButton>|
            <Dropdown overlay={
              <Menu>
                <Menu.Item onClick={() => this.handleMethod(record, 'addLowerLevel')}>
                  新建下级
                </Menu.Item>
                <Menu.Item 
                  disabled={record.father_id?false:true}
                  onClick={() => this.handleMethod(record, 'addSameLevel')}
                >
                  新建平级
                </Menu.Item>
                <Menu.Item
                  disabled={record.father_id?false:true}
                  onClick={() => this.handleDelete(record)}
                >
                  删除
                </Menu.Item>
              </Menu>
            }>
              <LinkButton>
                更多<Icon type="down" />
              </LinkButton>
            </Dropdown>
          </span>
        )
      },
    ];
  }

  // 异步获取所有类型的表层级
  getMeterLevel = async() => {
    // const {rawMeterLevels} = this.props;
    const result = await reqGetMeterLevel();
    if(result.status === 0){
      const meterLevels = translateDataToTree(result.data).reduce((pre, item) => {
        pre[item.type] = [item];
        return pre;
      }, {});
      const expandedRowKeys = result.data.reduce((pre, meterLevel) => {
        if (Object.keys(pre).indexOf(meterLevel.type) === -1){
          pre[meterLevel.type] = [meterLevel._id];
        }else {
          pre[meterLevel.type].push(meterLevel._id);
        }
        return pre;
      }, {});
      this.setState({
        meterLevels, 
        expandedRowKeys
      });
    }else {
      message.error(result.msg, 1);
    }
  }

  handleMethod = (record, method) => {
    this.setState({isShow: true});
    this.method = method;
    this.meterLevel = record;
  }

  handleSubmit = () => {
    this.form.validateFields(async(err, values) => {
      if(!err) {
        const newMeter = values;
        let result = null;
        if(this.method === 'addLowerLevel'){
          newMeter.father_id = this.meterLevel._id;
          newMeter.type = this.type;
          result = await reqAddMeterLevel(newMeter);
        }else if(this.method === 'addSameLevel'){
          newMeter.father_id = this.meterLevel.father_id;
          newMeter.type = this.type;
          result = await reqAddMeterLevel(newMeter);
        }else if(this.method === 'update'){
          newMeter._id = this.meterLevel._id;
          result = await reqUpdateMeterLevel(newMeter);
        }
        if(result.status === 0){
          this.getMeterLevel();
          this.form.resetFields();
          this.setState({isShow: false});
        }else {
          message.error(result.msg, 1);
        }
      }
    });
  }

  handleDelete = (record) => {
    Modal.confirm({
      title: `确认删除${record.name}及其子层级吗?`,
      onOk: async() => {
        const result = await reqDeleteMeterLevel(record._id);
        if(result.status === 0){
          this.getMeterLevel();
          message.success(`${record.name}这个表层级成功`, 1);
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
    this.type = this.props.location.pathname.split('/').pop();
    // this.props.asyncGetMeterLevels();
    this.getMeterLevel();
    this.meters = [
      {
        _id: '1',
        name: '1#INJ',
        type: 'water',
      },
      {
        _id: '2',
        name: '2#INJ',
        type: 'water'
      },
      {
        _id: '3',
        name: '1#R/B',
        type: 'water'
      },
      {
        _id: '4',
        name: '2#R/B',
        type: 'water'
      },
      {
        _id: '5',
        name: '1#无缝',
        type: 'water'
      },
      {
        _id: '6',
        name: '2#无缝',
        type: 'water'
      },
      {
        _id: '7',
        name: '1#INJ',
        type: 'elec'
      },
      {
        _id: '8',
        name: '2#INJ',
        type: 'elec'
      },
      {
        _id: '9',
        name: '1#R/B',
        type: 'elec'
      },
      {
        _id: '10',
        name: '2#R/B',
        type: 'elec'
      },
      {
        _id: '11',
        name: '1#无缝',
        type: 'elec'
      },
      {
        _id: '12',
        name: '2#无缝',
        type: 'elec'
      },
      {
        _id: '13',
        name: '1#INJ',
        type: 'gas'
      },
      {
        _id: '14',
        name: '2#INJ',
        type: 'gas'
      },
      {
        _id: '15',
        name: '1#R/B',
        type: 'gas'
      },
      {
        _id: '16',
        name: '2#R/B',
        type: 'gas'
      },
      {
        _id: '17',
        name: '1#无缝',
        type: 'gas'
      },
      {
        _id: '18',
        name: '2#无缝',
        type: 'gas'
      }
    ];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.type = nextProps.location.pathname.split('/').pop();
    }
  }

  render() {

    const {
      meterLevels, 
      isShow, 
      expandedRowKeys
    } = this.state;
    const typeMeterLevels = meterLevels[this.type];
    const typeExpandedRowKeys = expandedRowKeys[this.type];
    const {meterLevel, method} = this;
    return (
      <>
        {
          typeMeterLevels && typeMeterLevels.length?(
            <Table 
              style={{backgroundColor: 'white', minHeight: 300}}
              bordered
              size='small'
              rowKey='_id'
              expandedRowKeys={typeExpandedRowKeys}
              columns={this.columns} 
              dataSource={typeMeterLevels} 
              pagination={false}
            />
          ): null
        }
        <Modal
          title={method === 'update'? '编辑表层级':(method === 'addLowerLevel'? '新建下级':'新建平级')}
          visible={isShow}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({isShow: false});
            this.method = '';
            this.meterLevel = {};
            this.form.resetFields();
          }}
        >
          <MeterForm setForm={form => this.form=form} meters={this.meters} method={method} meterLevel={meterLevel}/>
        </Modal>
      </>
    )
  }
}

// export default connect(
//   state => ({rawMeterLevels: state.meterLevels}),
//   {asyncGetMeterLevels, asyncAddMeterLevels, asyncUpdateMeterLevels, asyncDeleteMeterLevels}
// )(Settings);
