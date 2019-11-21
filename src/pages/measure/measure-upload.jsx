import React, {Component} from 'react';

import {
  Card,
  Input,
  Table,
  Button,
  message,
  Icon
} from 'antd';

import {reqUploadMeasures} from '../../api';
import downloadTemplate from '../../utils/downloadTemplate';

import xlsxUtils from '../../utils/xlsxUtils';
import formatDate from '../../utils/format-excel-date';
import {measureConstants} from '../../utils/constants';
import LinkButton from '../../components/link-button/link-button';

export default class MeasureUpload extends Component {

  state = {
    dataSource: []
  }

  // 初始化表格结构
  initColumns = () => {
    this.columns = [
      { 
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '计量编号',
        dataIndex: '_id',
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
      },
      // {
      //   title: '操作',
      //   width: 100,
      //   render: (measure) => (
      //     <span>
      //       <LinkButton onClick={() => {this.showUpdate(measure)}}>编辑</LinkButton>
      //       {/* <LinkButton>确认</LinkButton> */}
      //       <LinkButton>查看</LinkButton>
      //     </span>
      //   )
      // }
    ];
    // this.rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(typeof selectedRowKeys, 'selectedRows: ', selectedRows);
    //   }
    // }
  }

  // 处理上传
  handleUpload = async () => {
    const {dataSource} = this.state;

    const result = await reqUploadMeasures(dataSource);
    if(result.status === 0){
      message.success('上传测量仪器成功', 1);
      this.setState({dataSource: []});
      this.props.history.replace('/measure');
    }else {
      message.error(result.msg, 1);
    }
  }

  // 处理取消上传
  handleCancel = () => {
    this.setState({dataSource: []});
  }

  // 文件读取后处理文件内容
  handleChange = (e) => {
    xlsxUtils.readWorkbookFromLocalFile(e.target.files[0], (json) => {
      // console.log(json);
      const measures = json.reduce((pre, item) => {
        let measure = {};
        Object.keys(measureConstants).forEach(key => {
          if(key === 'last_time' || key === 'next_time'){
            if(key === 'next_time' && item['检定周期'] === '长期'){
              measure[key] = '-';
            }else {
              if(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(item[measureConstants[key]])){
                measure[key] = item[measureConstants[key]];
              }
              if(typeof(item[measureConstants[key]]) === 'number'){
                // console.log(item[measureConstants[key]]);
                measure[key] = formatDate(item[measureConstants[key]], '/');
              }
            }
          }
          // else if(key === 'duration'){
            // measure[key] = parseInt(item[measureConstants[key]]).toString();
          // }
          else {
            measure[key] = item[measureConstants[key]];
          }
        });
        pre.push(measure);
        return pre;
      }, []);
      this.setState({dataSource: measures});
    });
  }

  // 处理模板下载
  handleExport = () => {
    downloadTemplate('measure');
  }
  
  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  render() {
    const {dataSource} = this.state;
    const title = (
      <span>
        <LinkButton style={{fontSize: 20}} 
          onClick={()=> {
            this.props.history.goBack();
            this.setState({dataSource: []});
        }}>
          <Icon type='arrow-left'/>
        </LinkButton>
        <span>返回</span>
      </span>
    );
    return (
      <Card title={title}>
        {
          dataSource.length>0? (
            <>
              <Table
                bordered
                rowKey='_id'
                dataSource={dataSource}
                columns={this.columns}
                size="small"
                pagination={{hideOnSinglePage: true, defaultPageSize: 500}}
              />
              <Button type='primary' onClick={this.handleUpload}>确认无误，点击上传</Button>&nbsp;&nbsp;
              <Button type='primary' onClick={this.handleCancel}>撤销</Button>
            </>
          ):(
            <>
              <span>请根据模板文件的格式进行上传</span>
              <LinkButton onClick={this.handleExport}>下载模板</LinkButton><br/>
              <Input type="file" onChange={this.handleChange} style={{width: 500}}/>
            </>
          )
        }
      </Card>
    );
  }
}