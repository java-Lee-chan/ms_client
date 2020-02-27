import React, {Component} from 'react';

import {Link, Switch, Route, Redirect} from 'react-router-dom';

import {
  Menu
} from 'antd';

import Settings from './settings';

export default class EnergySettings extends Component {
  render() {

    return (
      <div>
        <Menu mode="horizontal">
          <Menu.Item key="gas">
            <Link to='/energy/settings/gas'>
              <span>天然气表配置</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="elec">
            <Link to='/energy/settings/elec'>
              <span>电表配置</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="water">
            <Link to='/energy/settings/water'>
              <span>水表配置</span>
            </Link>
          </Menu.Item>
        </Menu>
        <div style={{marginTop: 15}}>
          <Switch>
            <Route path='/energy/settings/gas' component={Settings}/>
            <Route path='/energy/settings/elec' component={Settings}/>
            <Route path='/energy/settings/water' component={Settings}/>
            <Redirect to='/energy/settings/gas'/>
          </Switch>
        </div>
      </div> 
    )
  }
}