import React, {Component} from 'react';
import {
  Card,
  Timeline,
  Table,
  message,
} from 'antd';

import ReactEcharts from 'echarts-for-react';

import {reqGetRecentMeasures, reqSparePartTime} from '../../api';
import LinkButton from '../../components/link-button/link-button';
import './home.less';

export default class Home extends Component {

  state = {
    gasDateList: [], 
    gasValueList: [],
    elecDateList: [],
    elecValueList: [],
    waterDateList: [],
    waterValueList: [],
    time: '',
    dataSource: []
  }

  initColumns = () => {
    this.columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => (`${index + 1}`)
      },
      {
        title: '计量编号',
        dataIndex: '_id'
      },
      {
        title: '器具名称',
        dataIndex: 'name'
      },
      {
        title: '有效期至',
        dataIndex: 'next_time',
      }
    ]
  }

  getGasOptions = (dateList, valueList) => {
    return {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
      }],
      title: [{
        left: 'center',
        text: '科室天然气用量'
      }],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 40,
        height: 100,
      },
      xAxis: [{
        name: '位置',
        data: dateList
      }],
      yAxis: [{
        name: '用量 单位',
        splitLine: {show: false}
      }],
      series: [{
        type: 'bar',
        data: valueList,
      }]
    };
  }
  
  getWaterOptions = (dateList, valueList) => {
    return {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
      }],
      title: [{
        left: 'center',
        text: '科室水用量'
      }],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 40,
        height: 100
      },
      xAxis: [{
        data: dateList
      }],
      yAxis: [{
        name: '用量 单位',
        splitLine: {show: false}
      }],
      series: [{
        type: 'bar',
        data: valueList
      }]
    };
  }

  getElecOptions = (dateList, valueList) => {
    return {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
      }],
      title: [{
        left: 'center',
        text: '科室电用量'
      }],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 40,
        height: 100
      },
      xAxis: [{
        data: dateList
      }],
      yAxis: [{
        splitLine: {show: false}
      }],
      series: [{
        type: 'bar',
        data: valueList
      }]
    };
  }

  getMeasures = async() => {
    const result = await reqGetRecentMeasures();
    if(result.status === 0){
      this.length = result.data.length;
      const dataSource = result.data.sort((a, b) => a.next_time > b.next_time).splice(0, 5);
      this.setState({dataSource});
    }else {
      message.error(result.msg, 1);
    }
  }

  setFooter = () => {
    return (
      <span>
        <span>{`...共${this.length}个测量仪器快到期，点击`}</span>
        <LinkButton onClick={() => this.props.history.push('/measure')}>跳转到测量仪器界面</LinkButton>
      </span>
    );
  }

  getTimeLine = async() => {
    const result = await reqSparePartTime();
    if(result.status === 0){
      const timeLines = result.data;
      const lastTimeLines = timeLines.reduce((pre, item) => {
        if(pre[item.committer]){
          pre[item.committer] = pre[item.committer].time > item.time? pre[item.committer] : {time: item.time, _id: item._id};
        }else {
          pre[item.committer] = {time: item.time, _id: item._id};
        }
        return pre;
      }, {});
      // console.log(lastTimeLines);
      this.timeLineList = Object.keys(lastTimeLines).map(committer => (
        <Timeline.Item key={lastTimeLines[committer]._id}>{`${committer}在${lastTimeLines[committer].time}最后一次提交申购`}</Timeline.Item>
      ))
    }else {
      message.error('获取备件提交时间失败', 1); 
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  componentDidMount() {
    const date = new Date();
    const time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}  ${date.getHours() - 1}:00 ~ ${date.getHours()}:00`
    const data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];
    const dateList = data.map(function (item) {
      return item[0];
    });
    const valueList = data.map(function (item) {
      return item[1];
    });
    this.setState({
      gasDateList: dateList, 
      gasValueList: valueList,
      elecDateList: dateList,
      elecValueList: valueList,
      waterDateList: dateList,
      waterValueList: valueList,
      time
    });
    this.getMeasures();
    this.getTimeLine();
  }

  render() {

    const {
      gasDateList, 
      gasValueList, 
      elecDateList, 
      elecValueList, 
      waterDateList,
      waterValueList, 
      time,
      dataSource
    } = this.state;

    const title = (
      <span>{time}&nbsp;&nbsp;能源使用情况</span>
    )
    return (
      //   <p>左边放水电气上个小时的趋势图</p>
      <div className="home-container">
        <div className="home-left">
          <Card title={title} 
            style={{height: '100%'}} 
            bodyStyle={{display: 'flex', flexDirection: 'column', height: '100%'}}
          >
            <div className="home-left-top">
              <ReactEcharts style={{height: 200}} option={this.getGasOptions(gasDateList, gasValueList)}></ReactEcharts>
            </div>
            <div className="home-left-center">
              <ReactEcharts style={{height: 200}} option={this.getWaterOptions(waterDateList, waterValueList)}></ReactEcharts>
            </div>
            <div className="home-left-bottom">
            <ReactEcharts style={{height: 200}} option={this.getElecOptions(elecDateList, elecValueList)}></ReactEcharts>
            </div>
          </Card>
        </div>
        <div className="home-right">
          {/* <p>右边上面放哪些测量仪器还有3个月到期</p> */}
          <div className="home-right-top">
            <Card title='下列仪器将在3个月内到期' style={{height: '100%', overflow: 'auto'}} bodyStyle={{padding: 0}}>
              <Table
                rowKey='_id'
                columns={this.columns}
                dataSource={dataSource}
                size='small'
                pagination={false}
                footer={this.setFooter}
              />
            </Card>
          </div>
          {/* <p>右边下面放本月有哪些人提交备件申请的时间线</p> */}
          <div className="home-right-bottom">
            <Card title='本月备件提交情况' style={{height: '100%'}}>
              <Timeline>
                {
                  this.timeLineList
                }
              </Timeline>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}