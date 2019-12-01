import React, {Component} from 'react';
import {
  Card,
  Table,
  Button,
} from 'antd';

export default class Report extends Component {

  state = {
    type: 'gas'
  }

  onTabChange = (key, type) => {
    this.setState({[type]: key});
  }

  UNSAFE_componentWillMount() {
    this.tabList = [
      {
        key: 'gas',
        tab: '用气量'
      },
      {
        key: 'elec',
        tab: '用电量'
      },
      {
        key: 'water',
        tab: '用水量'
      }
    ]
  }
  render() {
    return (
      <Card
        tabList={this.tabList}
        activeTabKey={this.state.key}
        onTabChange={key => this.onTabChange(key, 'type')}
      >

      </Card>
    )
  }
}