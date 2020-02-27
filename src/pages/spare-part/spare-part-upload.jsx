import React, {Component} from 'react';

import {
  Table,
  Button,
  Input,
  Card,
  Icon,
  message
} from 'antd';

import {connect} from 'react-redux';

import {reqUploadSpareParts} from '../../api';

import downloadTemplate from '../../utils/downloadTemplate';
import xlsxUtils from '../../utils/xlsxUtils.js';
import formatDate from '../../utils/format-excel-date';
import {sparePartConstants} from '../../utils/constants';
import LinkButton from '../../components/link-button/link-button';

class SparePartUpload extends Component {

  state = {
    spareParts: []
  }

  initColumns = () => {
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index'
      },
      {
        title: '备件名称',
        dataIndex: 'name',
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
    ]
  }
  
  handleExport = () => {
    downloadTemplate('spare-part');
  }

  handleChange = (e) => {
    xlsxUtils.readWorkbookFromLocalFile(e.target.files[0], (json) => {
      // console.log(json);
      const spareParts = json.reduce((pre, item, index) => {
        let sparePart = {};
        Object.keys(sparePartConstants).forEach(key => {
          if(key === 'time'){
            if(typeof(item[sparePartConstants[key]]) === 'number'){
              sparePart[key] = formatDate(item[sparePartConstants[key]], '/');
            }else if(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(item[sparePartConstants[key]])){
              sparePart[key] = item[sparePartConstants[key]];
            }
          }else {
            sparePart[key] = item[sparePartConstants[key]];
          }
        });
        sparePart.committer = sparePart.committer ? sparePart.committer: this.props.user.username;
        sparePart.key = index;
        pre.push(sparePart);
        return pre;
      }, []);
      this.setState({spareParts});
    });
  }

  handleUpload = async () => {
    const {spareParts} = this.state;

    const result = await reqUploadSpareParts(spareParts);
    if(result.status === 0){
      message.success('上传备件采购单成功', 1);
      this.setState({spareParts: []});
      this.props.history.replace('/spare-part');
    }else {
      message.error(result.msg, 1);
    }
  }

  handleCancel = () => {
    this.setState({spareParts: []});
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  render() {
    const {spareParts} = this.state;

    const title = (
      <span>
        <LinkButton style={{fontSize: 20}} 
          onClick={()=> {
            this.props.history.goBack();
            this.setState({spareParts: []});
        }}>
          <Icon type='arrow-left'/>
        </LinkButton>
        <span>返回</span>
      </span>
    );

    return (
      <Card
        title={title}
        style={{minHeight: '100%'}}
      >
        {
          spareParts.length > 0? (
            <>
              <Table
                bordered
                dataSource={spareParts}
                columns={this.columns}
                size="small"
                pagination={{hideOnSinglePage: true}}
              /><br/>
              <Button type='primary' onClick={this.handleUpload}>确认无误，点击上传</Button>&nbsp;&nbsp;
              <Button type='primary' onClick={this.handleCancel}>撤销</Button>
            </>
          ):(
            <>
              <span style={{fontWeight: 'bold'}}>请根据模板文件的格式进行上传</span>
              <LinkButton onClick={this.handleExport}>下载模板</LinkButton><br/><br/>
              <Input type="file" onChange={this.handleChange}/>
            </>
          )
        }
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)(SparePartUpload);