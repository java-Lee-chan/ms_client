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
  DatePicker
} from 'antd';

import moment from 'moment';
import LinkButton from '../../components/link-button/link-button'
import {reqGetMeasures, reqConfrimMeasures} from '../../api';
import MemoryUtils from '../../utils/memoryUtils';

import './measure-home.less';

const InputGroup = Input.Group;
const {Option} = Select;
const Item = Form.Item;

export default class MeasureHome extends Component {

  state = {
    measures: [],
    searchMeasures: [],
    selectedRowKeys: [],
    selectedRows: [],
    searchOption: 'name',   // 根据什么搜索
    searchText: '',         // 搜索关键字
    isShowConfirm: false,   // 是否显示批量确认框
    confirmTime: moment()
  }

  initColumns = () => {
    this.columns = [
      {
        title: '计量编号',
        dataIndex: '_id',
        className: 'column'
      },
      {
        title: '器具名称',
        dataIndex: 'name',
      },
      // {
      //   title: '规格型号',
      //   dataIndex: 'model'
      // },
      // {
      //   title: '出厂编号',
      //   dataIndex: 'factory_num'
      // },
      // {
      //   title: '制造商',
      //   dataIndex: 'manufacturer'
      // },
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
      // {
      //   title: 'ABC管理',
      //   dataIndex: 'abc'
      // },
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
          }
        ]
      },
      // {
      //   title: '用途',
      //   dataIndex: 'usage'
      // },
      // {
      //   title: '送检类型',
      //   dataIndex: 'type'
      // },
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
          }
        ]
      },
      {
        title: '操作',
        width: 100,
        render: (measure) => (
          <span>
            <LinkButton onClick={() => {this.showUpdate(measure)}}>编辑</LinkButton>
            {/* <LinkButton>确认</LinkButton> */}
            <LinkButton onClick={() => {this.showDetail(measure)}}>查看</LinkButton>
          </span>
        )
      }
    ];
  }

  getMeasures = async() => {
    const result = await reqGetMeasures();
    if(result.status === 0){
      const measures = result.data;
      this.setState({measures, searchMeasures: measures});
    }else {
      message.error(result.msg, 1);
    }
  }

  showUpdate = (measure) => {
    MemoryUtils.measure = measure;
    this.props.history.push('/measure/addupdate');
  }

  showDetail = (measure) => {
    this.props.history.push({pathname: '/measure/addupdate', state: {measure}});
  }

  handleSearch = (event) => {
    const searchText = event.target.value.trim();
    // this.setState({searchText});
    const {measures, searchOption} = this.state;
    const searchMeasures = measures.filter(measure => measure[searchOption].toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    this.setState({searchMeasures});
  }

  selectRow = (record) => {
    // const selectedRows = [...this.state.selectedRows];
    // const selectedRowKeys = [...this.state.selectedRowKeys];
    // if (selectedRows.indexOf(record) >= 0) {
    //   selectedRows.splice(selectedRows.indexOf(record), 1);
    //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    // } else {
    //   selectedRows.push(record);
    //   selectedRowKeys.push(record.key);
    // }
    // this.setState({ selectedRows, selectedRowKeys });
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  handleOk = async() => {
    const {selectedRows, confirmTime} = this.state;
    let flag = true;
    let duration = '-';
    selectedRows.forEach(selectedRow => {
      if(duration === '-'){
        duration = selectedRow.duration;
      }else if(duration !== selectedRow.duration){
        flag = false;
      }
      selectedRow.last_time = confirmTime.format('YYYY/MM/DD');
      selectedRow.next_time = moment(selectedRow.last_time, 'YYYY/MM/DD').add(parseInt(selectedRow.duration), 'M').subtract(1, 'd').format('YYYY/MM/DD');
      selectedRow.result = '合格';
    });
    if(flag){
      // console.log(selectedRows);
      const result = await reqConfrimMeasures(selectedRows);
      if(result.status === 0){
        this.setState({isShowConfirm: false});
        this.getMeasures();
      }else {
        message.error(result.msg, 1);
      }
    }else {
      message.error('请确认选择的计量仪器周期是否相同');
    }
  }
 
  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getMeasures();
  }

  render() {
    const {searchMeasures, isShowConfirm, confirmTime, selectedRows, selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys, selectedRows});
      }
    };
    
    const title = (
      <InputGroup compact>
        <Select defaultValue="name" onChange={searchOption => this.setState({searchOption})}>
          <Option value="name">器具名称</Option>
          <Option value="_id">计量编号</Option>
        </Select>
        <Input 
          style={{ width: 200 }}
          placeholder="输入搜索内容"
          onChange={this.handleSearch}/>
      </InputGroup>
    );
    const extra = (
      <span>
        <Button type='primary' onClick={() => {this.props.history.push('/measure/upload')}}>
          <Icon type='upload'/>
          <span>上传</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}}>
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
              message.error('却选中至少一个测量仪器');
            }
          }}>
          <Icon type='plus'/>
          <span>批量确认</span>
        </Button>
      </span>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          dataSource={searchMeasures}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
          rowSelection={rowSelection}
          // onRow={(record) => ({
          //   onClick: () => {
          //     this.selectRow(record);
          //   },
          // })}
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
    )
  }
}