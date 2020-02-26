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

import './base-data.less';

const {Sider, Header, Content} = Layout;

const {Search} = Input;

const {RangePicker} = DatePicker;


export default class BaseData extends Component {

  state = {
    meterLevels: [],
    expandedRowKeys: [],
    dateList: [],
    valueList: [],
    duration: 'day',
    type: 'line',
    searchValue: '',
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
      // console.log(result.data);
      const meterLevels = this.translateDataToTree(result.data);
      console.log(meterLevels);
      this.setState({meterLevels});
    }else {
      message.error(result.msg, 1);
    }
  }

  translateDataToTree = (data) => {
    let parents = data.filter(value => value.father_id === undefined || value.father_id === null);
    let children = data.filter(value => value.father_id !== undefined && value.father_id !== null);
    let translator = (parents, children) => {
      parents.forEach(parent => {
        children.forEach((current, index) => {
          if(current.father_id === parent._id){
            let temp = JSON.parse(JSON.stringify(children));
            temp.splice(index, 1);
            translator([current], temp);
            typeof parent.children !== 'undefined' ? parent.children.push(current): parent.children = [current]
          }
        })
      })
    }

    translator(parents, children);

    return parents;
  }


  getLineOptions = (dateList, valueList) => {
    return {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
      }],
      title: [{
        left: 'center',
        text: '今日用量'
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

  getBarOptions = (dateList, valueList) => {
    return {
      title: [{
        left: 'center',
        text: '今日用量'
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
    const data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
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

    const {meterLevels, dateList, valueList, type, expandedRowKeys} = this.state;

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
              defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
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
                <ReactEcharts option={this.getLineOptions(dateList, valueList)} className="base-data-right-content-chart"></ReactEcharts>
              ): (
                <ReactEcharts option={this.getBarOptions(dateList, valueList)} className="base-data-right-content-chart"></ReactEcharts>
              )
            }
          </Content>
        </Layout>
      </Layout>
    )
  }
} 