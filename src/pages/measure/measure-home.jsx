import React, {Component} from 'react';

import {
  Card,
  Table,
  Icon,
  Button,
  Modal,
  Input,
  Select,
} from 'antd';

import LinkButton from '../../components/link-button/link-button'
import MemoryUtils from '../../utils/memoryUtils';

import './measure-home.less';

const InputGroup = Input.Group;
const {Option} = Select;

export default class MeasureHome extends Component {

  state = {
    measures: [],
    searchMeasures: [],
    selectedRowKeys: '',
    selectedRows: [],
    searchOption: 'name',   // 根据什么搜索
    searchText: '',         // 搜索关键字
  }

  initColumns = () => {
    this.columns = [
      {
        title: '计量编号',
        dataIndex: 'num',
        className: 'column'
      },
      {
        title: '器具名称',
        dataIndex: 'name',
      },
      {
        title: '规格型号',
        dataIndex: 'model'
      },
      {
        title: '出厂编号',
        dataIndex: 'factory_num'
      },
      {
        title: '制造商',
        dataIndex: 'manufacturer'
      },
      {
        title: '检定时间',
        dataIndex: 'last_time'
      },
      {
        title: '有效期至',
        dataIndex: 'next_time',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.next_time - b.next_time
      },
      {
        title: '检定周期',
        dataIndex: 'duration'
      },
      {
        title: 'ABC管理',
        dataIndex: 'abc'
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
          }
        ]
      },
      {
        title: '用途',
        dataIndex: 'usage'
      },
      {
        title: '送检类型',
        dataIndex: 'type'
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
            <LinkButton>查看</LinkButton>
          </span>
        )
      }
    ];
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(typeof selectedRowKeys, 'selectedRows: ', selectedRows);
      }
    }
  }

  getMeasures = () => {
    
  }

  showUpdate = (measure) => {
    MemoryUtils.measure = measure;
    this.props.history.push('/measure/addupdate');
  }

  handleSearch = (value) => {
    const {measures, searchOption} = this.state;
    const searchMeasures = measures.filter(measure => measure[searchOption].includeOf(value));
    this.setState({searchMeasures});
  }
 
  componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    this.getMeasures();
  }

  render() {
    const {searchMeasures, searchText} = this.state;
    const title = (
      <InputGroup compact>
        <Select defaultValue="name" onChange={searchOption => this.setState({searchOption})}>
          <Option value="name">器具名称</Option>
          <Option value="num">计量编号</Option>
        </Select>
        <Input value={searchText} 
          style={{ width: 200 }}
          placeholder="input search text"
          onChange={e => this.setState({searchText: e.target.value})}/>
        <Button type='primary' onClick={this.handleSearch}>搜索</Button>
      </InputGroup>
    );
    const extra = (
      <span>
        <Button type='primary' 
          // onClick={this.props.history.push({pathname: "/upload", state: {type: 'measure'}})}
        >
          <Icon type='upload'/>
          <span>上传</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}}onClick={() => {this.props.history.push('/measure/addupdate')}}>
          <Icon type='plus'/>
          <span>添加</span>
        </Button>
        <Button type='primary' style={{marginLeft: 10}}>
          <Icon type='plus'/>
          <span>批量确认</span>
        </Button>
      </span>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          dataSource={searchMeasures}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
          rowSelection={this.rowSelection}
        />
        {/* <Modal
          title={isAdd ?'添加测量仪器' : '编辑测量仪器'}
          visible={isShowAddUpdate}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({isShowAddUpdate: false});
          }}
        >
          
        </Modal> */}
      </Card>
    )
  }
}