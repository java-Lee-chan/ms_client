import React, {Component} from 'react';
import {
  ConfigProvider,
  Card,
  Table,
  Button,
  DatePicker,
  Icon,
  message,
  Modal,
} from 'antd';

import moment from 'moment';
import {connect} from 'react-redux';

import zhCN from 'antd/es/locale/zh_CN';
import LinkButton from '../../components/link-button/link-button';
import {sparePartConstants} from '../../utils/constants';
import xlsxUtils from '../../utils/xlsxUtils';
import {reqGetSpareParts, reqConfirmSpareParts} from '../../api';

const {RangePicker} = DatePicker;

class SparePartHome extends Component {

  state = {
    spareParts: [],
    timeRange: [moment().startOf('month'), moment().endOf('month')],
    selectedRows: [],
    selectedRowKeys: [],
    isShowConfirm: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '序号',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '备件名称',
        dataIndex: 'name'
      },
      {
        title: '型号',
        dataIndex: 'model'
      },
      {
        title: '规格',
        dataIndex: 'specs'
      },
      {
        title: '品牌',
        dataIndex: 'brand'
      },
      {
        title: '单价',
        dataIndex: 'price'
      },
      {
        title: '数量',
        dataIndex: 'num'
      },
      {
        title: '单位',
        dataIndex: 'unit'
      },
      {
        title: '总价',
        dataIndex: 'total'
      },
      {
        title: '用途',
        dataIndex: 'usage'
      },
      {
        title: '提交日期',
        dataIndex: 'time'
      },
      {
        title: '提交人',
        dataIndex: 'committer'
      },
      {
        title: '状态',
        dataIndex: 'status'
      },
      {
        title: '操作',
        render: (sparePart) => (
          <LinkButton 
            onClick={() => {
              this.props.history.push({pathname: '/spare-part/addupdate', state: {sparePart}});
            }}
          >
            编辑
          </LinkButton>
        )
      }
    ]
  }

  getSpareParts = async (timeRange) => {
    const start = timeRange[0].format('YYYY/MM/DD');
    const end = timeRange[1].format('YYYY/MM/DD');
    const committer = this.props.user.username;
    const result = await reqGetSpareParts(start, end, committer);
    if(result.status === 0){
      const spareParts = result.data;
      this.setState({spareParts});
      if (!this.initialSpareParts){
        this.initialSpareParts = spareParts;
      }
    }else {
      message.error(result.msg, 1);
    }
  }

  handleRangeChange = (date, dateString) => {
    // console.log(date, dateString);
    this.setState({timeRange: date});
    if(date.length === 0){
      this.setState({spareParts: this.initialSpareParts});
    }else {
      this.getSpareParts(date);
    }
  }

  handleExport = () => {
    const {spareParts} = this.state;
    const results = spareParts.reduce((pre, item, index) => {
      let sparePart = {};
      Object.keys(sparePartConstants).forEach(key => {
        sparePart[sparePartConstants[key]] = item[key];
      });
      sparePart['序号'] = index + 1;
      pre.push(sparePart);
      console.log(pre);
      return pre;
    }, []);
    xlsxUtils.exportWorkbookFromServerFile(results, 'spare-part');
  }

  handleOk = async() => {
    const {selectedRows, timeRange} = this.state;
    const result = await reqConfirmSpareParts(selectedRows);
    if(result.status === 0){
      this.setState({isShowConfirm: false, selectedRowKeys: [], selectedRows: []});
      this.getSpareParts(timeRange);
    }else {
      message.error(result.msg, 1);
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    const {timeRange} = this.state;
    this.getSpareParts(timeRange);
  }

  render() {

    const {spareParts, timeRange, isShowConfirm, selectedRows, selectedRowKeys} = this.state;
    const {user} = this.props;
    // console.log(timeRange);

    const title = (
      <>
        <span>请选择需查询的提交时间:</span>&nbsp;&nbsp;
        <RangePicker defaultValue={timeRange} onChange={this.handleRangeChange} format='YYYY/MM/DD'/>
      </>
    );

    const extra = (
      <span>
        <Button type='primary' onClick={() => this.props.history.push('/spare-part/upload')}>
          <Icon type='upload'/>
          <span>上传</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}} onClick={this.handleExport}>
          <Icon type='download'/>
          <span>导出</span>
        </Button>
        {
          (user.username === 'admin') || (user.role.menus.indexOf('spare-part-all-pass') !== -1) ? (
            <Button 
              type='primary' 
              style={{marginLeft: 10}} 
              onClick={() => {
                if(selectedRows.length > 0){
                  this.setState({isShowConfirm: true});
                }else {
                  message.error('请选中至少一个备件');
                }
              }}>
              <Icon type='plus'/>
              <span>批量通过</span>
            </Button>
          ): (
            <Button type='primary' style={{marginLeft: 10}} onClick={() => this.props.history.push('/spare-part/addupdate')}>
              <Icon type='plus'/>
              <span>申购</span>
            </Button>
          )
        }
      </span>
    );

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, selectedRows});
      }
    };

    const onRow = record => ({
      onClick: () => {
        let val = record['_id'];
        let rowKeys = [];
        let rows = [];
        selectedRowKeys.forEach(x => { rowKeys.push(x); });
        selectedRows.forEach(x => { rows.push(x); });
        let idx = rowKeys.indexOf(val);
        if(idx === -1){
          rowKeys.push(val);
          rows.push(record);
        }else {
          rowKeys.splice(idx, 1);
          rows.splice(idx, 1);
        } 
        this.setState({selectedRowKeys: rowKeys, selectedRows: rows});
      }
    })

    return (
      <ConfigProvider locale={zhCN}>
        <Card title={title} extra={extra}>
          <Table
            bordered
            rowKey='_id'
            dataSource={spareParts}
            columns={this.columns}
            size='small'
            rowSelection={rowSelection}
            onRow={onRow}
          />
          <Modal
            title='批量通过'
            visible={isShowConfirm}
            onOk={this.handleOk}
            onCancel={() => {
              this.setState({isShowConfirm: false});
            }}
          >
            <p>选取的备件同意本月申购吗？</p>
          </Modal>
        </Card>
      </ConfigProvider>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)(SparePartHome);