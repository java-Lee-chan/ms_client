import React, {Component} from 'react';

import {
  Layout,
  Table,
  Input,
  Icon,
  Radio,
  DatePicker,
  message
} from 'antd';

import moment from 'moment';

import ReactEcharts from 'echarts-for-react';
import {reqGetMeterLevel} from '../../api';
import { translateDataToTree } from '../../utils/translateDataToTree';

import './base-data.less';

const {Sider, Header, Content} = Layout;

const {Search} = Input;

const {RangePicker} = DatePicker;


export default class BaseData extends Component {

  state = {
    rawMeterLevels: [],
    meterLevels: [],
    expandedRowKeys: [],
    dateList: [],
    valueList: [],
    duration: 'day',
    type: 'line',
    searchValue: '',
    meter_id: ''
  }

  initColumns = () => {
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type'
      }
    ]
  }

  getMeterLevel = async() => {
    const result = await reqGetMeterLevel();
    if(result.status === 0){
      const rawMeterLevels = result.data;
      const meterLevels = translateDataToTree(rawMeterLevels);
      const meter_id = meterLevels[0]._id;
      const expandedRowKeys = result.data.map(item => {
        return item._id;
      });
      this.setState({
        rawMeterLevels, meterLevels, meter_id, expandedRowKeys
      });
    }else {
      message.error(result.msg, 1);
    }
  }

  getLineOptions = (dateList, valueList, meter_id) => {
    const meter = this.state.rawMeterLevels.filter(item => item._id === meter_id)[0];
    const text = meter ? `${meter.name}-${meter.type}今日用量` : '今日用量';
    return {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
      }],
      title: [{
        left: 'center',
        text
      }],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{
        data: dateList
      }],
      yAxis: [{
        splitLine: {show: false}
      }],
      // grid: [{
      //   bottom: '60%'
      // }],
      series: [{
        type: 'line',
        // showSymbol: false,
        data: valueList
      }]
    };
  }

  getBarOptions = (dateList, valueList, meter_id) => {
    const meter = this.state.rawMeterLevels.filter(item => item._id === meter_id)[0];
    const text = meter ? `${meter.name}-${meter.type}今日用量` : '今日用量';
    return {
      title: [{
        left: 'center',
        text
      }],
      xAxis: {
        type: 'category',
        data: dateList
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: valueList,
          type: 'bar'
      }]
    };
  }

  onChange = (event, type) => {
    const value = event.target.value;
    this.setState({[type]: value});
  } 

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    const data = [["0:00",116],["1:00",129],["2:00",135],["3:00",86],["4:00",73],["5:00",85],["6:00",73],["7:00",68],["8:00",92],["9:00",130],["10:00",245],["11:00",139],["12:00",115],["13:00",111],["14:00",309],["15:00",206],["16:00",137],["17:00",128],["18:00",85],["19:00",94],["20:00",71],["21:00",106],["22:00",84],["23:00",93],["24:00",85]];
    const dateList = data.map(function (item) {
      return item[0];
    });
    const valueList = data.map(function (item) {
      return item[1];
    });
    this.setState({dateList, valueList});
    this.getMeterLevel();
  }

  render() {

    const {meterLevels, dateList, valueList, type, meter_id, expandedRowKeys} = this.state;

    return(
      <Layout className="base-data-container">
        <Sider className="base-data-left" width={300}>
          <Search
            enterButton={
              <span>
                <span>搜索</span>
                <Icon type='search'/>
              </span>
            }
          />
          <Table
            rowKey='_id'
            columns={this.columns}
            dataSource={meterLevels}
            pagination={false}
            onRow={record => {
                return {
                  onClick: event => {
                    this.setState({
                      meter_id: record._id
                    })
                  }, // 点击行
                };
              }
            }
            expandedRowKeys={expandedRowKeys}
          />
        </Sider>
        <Layout className="base-data-right">
          <Header className="base-data-right-header">
            <Radio.Group defaultValue='day' buttonStyle='solid' onChange={(event) => this.onChange(event, 'duration')}>
              <Radio.Button value='day'>日</Radio.Button>
              <Radio.Button value='month'>月</Radio.Button>
              <Radio.Button value='year'>年</Radio.Button>
            </Radio.Group>
            <RangePicker
              defaultValue={[moment(moment(), 'YYYY/MM/DD'), moment(moment(), 'YYYY/MM/DD')]}
              format='YYYY/MM/DD'
              className="base-data-right-header-date"
            />
            <Radio.Group defaultValue='line' buttonStyle='solid' onChange={(event) => this.onChange(event, 'type')}>
              <Radio.Button value='line'>
                <Icon type='line-chart'/>
              </Radio.Button>
              <Radio.Button value='bar'>
                <Icon type='bar-chart'/>
              </Radio.Button>
            </Radio.Group>
          </Header>
          <Content className="base-data-right-content">
            {
              type === 'line'? (
                <ReactEcharts option={this.getLineOptions(dateList, valueList, meter_id)} className="base-data-right-content-chart"></ReactEcharts>
              ): (
                <ReactEcharts option={this.getBarOptions(dateList, valueList, meter_id)} className="base-data-right-content-chart"></ReactEcharts>
              )
            }
          </Content>
        </Layout>
      </Layout>
    )
  }
} 