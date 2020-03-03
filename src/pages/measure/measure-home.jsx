import React, {Component} from 'react';

import {
  Card,
  Table,
  Icon,
  Button,
  Modal,
  Input,
  Select,
  message,
  Form,
  DatePicker,
  ConfigProvider
} from 'antd';

import zhCN from 'antd/es/locale/zh_CN';

import moment from 'moment';
import LinkButton from '../../components/link-button/link-button'
import {reqGetMeasures, reqConfrimMeasures} from '../../api';
import MemoryUtils from '../../utils/memoryUtils';
import xlsxUtils from '../../utils/xlsxUtils.js';
import {measureConstants} from '../../utils/constants';

import './measure-home.less';

const InputGroup = Input.Group;
const {Option} = Select;
const Item = Form.Item;
const {RangePicker} = DatePicker;

export default class MeasureHome extends Component {

  state = {
    measures: [],
    searchMeasures: [],
    selectedRows: [],
    selectedRowKeys: [],
    searchOption: 'name',   // 根据什么搜索
    searchText: '',         // 搜索关键字
    isShowConfirm: false,   // 是否显示批量确认框
    confirmTime: moment()
  }

  // 初始化表格结构
  initColumns = () => {
    this.columns = [
      // {
      //   title: '序号',
      //   render: (text, record, index) => (`${index + 1}`)
      // },
      {
        title: '计量编号',
        dataIndex: '_id',
      },
      {
        title: '器具名称',
        dataIndex: 'name',
      },
      {
        title: '检定时间',
        dataIndex: 'last_time'
      },
      {
        title: '有效期至',
        dataIndex: 'next_time',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.next_time < b.next_time
      },
      {
        title: '检定周期',
        dataIndex: 'duration'
      },
      {
        title: '检定结果',
        dataIndex: 'result'
      },
      {
        title: '使用地点',
        dataIndex: 'location',
        filters: [
          {
            text: 'INJ',
            value: 'INJ'
          },
          {
            text: 'BPR',
            value: 'BPR'
          },
          {
            text: 'INP',
            value: 'INP'
          },
          {
            text: '保全系',
            value: '保全系'
          },
          {
            text: '品质系',
            value: '品质系'
          }
        ],
        onFilter: (value, record) => record.location.indexOf(value) === 0,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: '送检',
            value: '送检',
          },
          {
            text: '在库',
            value: '在库',
          },
          {
            text: '维修',
            value: '维修',
          },
          {
            text: '新增',
            value: '新增',
          },
        ],
        onFilter: (value, record) => (record.status ? record.status.indexOf(value) === 0: false),
      },
      {
        title: '操作',
        width: 100,
        render: (measure) => (
          <span>
            <LinkButton onClick={() => {this.showUpdate(measure)}}>编辑</LinkButton>
            <LinkButton onClick={() => {this.showDetail(measure)}}>查看</LinkButton>
          </span>
        )
      }
    ];
  }

  // 获取所有测量仪器
  getMeasures = async() => {
    const result = await reqGetMeasures();
    if(result.status === 0){
      const measures = result.data;
      this.setState({measures, searchMeasures: measures});
    }else {
      message.error(result.msg, 1);
    }
  }

  // 显示编辑界面
  showUpdate = (measure) => {
    MemoryUtils.measure = measure;
    this.props.history.push('/measure/addupdate');
  }

  // 显示查看界面
  showDetail = (measure) => {
    this.props.history.push({pathname: '/measure/addupdate', state: {measure}});
  }

  // 处理文字搜索
  handleSearch = (event) => {
    const searchText = event.target.value.trim();
    // this.setState({searchText});
    const {measures, searchOption} = this.state;
    const searchMeasures = measures.filter(measure => measure[searchOption].toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    this.setState({searchMeasures});
  }

  // 处理日期范围搜索
  handleRangeChange = (date, dateString) => {
    // console.log(date,dateString);
    const {measures} = this.state;
    if(date.length > 0){
      const searchMeasures = measures.filter(measure => (measure.next_time < dateString[1] && measure.next_time > dateString[0]));
      this.setState({searchMeasures});
    }else {
      this.setState({searchMeasures: measures});
    }
  }

  // 处理导出
  handleExport = () => {
    const {searchMeasures} = this.state;
    const measures = searchMeasures.reduce((pre, item, index) => {
      let measure = {};
      Object.keys(measureConstants).forEach(key => {
        measure[measureConstants[key]] = item[key];
      });
      measure['序号'] = index + 1;
      pre.push(measure);
      return pre;
    }, []);
    xlsxUtils.exportWorkbookFromServerFile(measures, 'measure');
  }

  // 批量确认
  handleOk = async() => {
    const {selectedRows, confirmTime} = this.state;
    let flag = true;
    let duration = '';
    selectedRows.forEach(selectedRow => {
      if(selectedRow.duration === '长期'){
        flag = false;
        return;
      }else if(duration === ''){
        duration = selectedRow.duration;
      }else if(duration !== selectedRow.duration){
        flag = false;
        return;
      }
    });
    duration = '';
    if(flag){
      // console.log(selectedRows);
      selectedRows.forEach(selectedRow => {
        selectedRow.last_time = confirmTime.format('YYYY/MM/DD');
        selectedRow.next_time = moment(selectedRow.last_time, 'YYYY/MM/DD').add(parseInt(selectedRow.duration), 'M').subtract(1, 'd').format('YYYY/MM/DD');
        selectedRow.result = '合格';
      });
      const result = await reqConfrimMeasures(selectedRows);
      if(result.status === 0){
        this.setState({isShowConfirm: false, selectedRowKeys: [], selectedRows: []});
        this.getMeasures();
      }else {
        message.error(result.msg, 1);
      }
    }else {
      message.error('请确认选择的计量仪器是否有周期或周期是否相同');
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getMeasures();
  }

  render() {
    const {searchMeasures, isShowConfirm, confirmTime, selectedRows, selectedRowKeys, searchOption} = this.state;

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(selectedRows);
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
        // console.log(idx);
        if (idx === -1) { 
          rowKeys.push(val); 
          rows.push(record);
        } else { 
          rowKeys.splice(idx, 1);
          rows.splice(idx, 1);
        }
        // console.log(rowKeys);
        this.setState({selectedRowKeys: rowKeys, selectedRows: rows});
      }
    });
      

    const pagination = {
      size: 'small', 
      total: searchMeasures.length, 
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '30', '50', '100'], 
      showQuickJumper: true
    };
    
    const title = (
      <InputGroup compact>
        <Select defaultValue="name" onChange={searchOption => this.setState({searchOption, searchMeasures: this.state.measures})}>
          <Option value="name">器具名称</Option>
          <Option value="_id">计量编号</Option>
          <Option value="next_time">有效期至</Option>
        </Select>
        {searchOption === 'next_time'? (
          <RangePicker onChange={this.handleRangeChange} format='YYYY/MM/DD'/>
        ):(
          <Input 
            style={{ width: 200 }}
            placeholder="输入搜索内容"
            onChange={this.handleSearch}/>
        )}
      </InputGroup>
    );

    const extra = (
      <span>
        <Button type='primary' onClick={() => {this.props.history.push('/measure/upload')}}>
          <Icon type='upload'/>
          <span>上传</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}} onClick={this.handleExport}>
          <Icon type='download'/>
          <span>导出</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}} onClick={() => {this.props.history.push('/measure/addupdate')}}>
          <Icon type='plus'/>
          <span>添加</span>
        </Button>
        <Button type='primary' 
          style={{marginLeft: 10}} 
          onClick={() => {
            if(selectedRows.length > 0){
              this.setState({isShowConfirm: true});
            }else {
              message.error('请选中至少一个测量仪器');
            }
          }}>
          <Icon type='plus'/>
          <span>批量确认</span>
        </Button>
      </span>
    );

    return (
      <ConfigProvider locale={zhCN}>
        <Card title={title} extra={extra}>
          <Table
            bordered
            rowKey='_id'
            dataSource={searchMeasures}
            columns={this.columns}
            pagination={pagination}
            rowSelection={rowSelection}
            onRow={onRow}
            size='small'
          />
          <Modal
            title='批量确认'
            visible={isShowConfirm}
            onOk={this.handleOk}
            onCancel={() => {
              this.setState({isShowConfirm: false});
            }}
          >
            <Item label="选择检定日期">
              <DatePicker value={confirmTime} onChange={(date) => this.setState({confirmTime: date})}/>
            </Item>
          </Modal>
        </Card>
      </ConfigProvider>
    )
  }
}