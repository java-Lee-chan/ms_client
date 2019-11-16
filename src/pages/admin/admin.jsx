import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Redirect, Route, Switch} from 'react-router-dom';

import { Layout } from 'antd';

import Header from '../../components/header/header';
import LeftNav from '../../components/left-nav/left-nav';

import Measure from '../measure/measure';
import SparePart from '../spare-part/spare-part';
import Gas from '../gas/gas';
import Elec from '../elec/elec';
import Water from '../water/water';
import User from '../user/user';
import Role from '../role/role';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {

    const user = this.props.user;
    if(!user || !user._id){
      return <Redirect to='/login'/>
    }

    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider width={150}>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header/>
          <Content style={{margin: 15, backgroundColor: 'white'}}>
            <Switch>
              <Redirect from='/' to='/home' exact/>
              <Route path='/measure' component={Measure}/>
              <Route path='/spare-part' component={SparePart}/>
              <Route path='/energy/gas' component={Gas}/>
              <Route path='/energy/elec' component={Elec}/>
              <Route path='/energy/water' component={Water}/>
              <Route path='/user' component={User}/>
              <Route path='/role' component={Role}/>
            </Switch>
          </Content>
          <Footer style={{height: '5%', lineHeight: '5%', textAlign: 'center', backgroundColor: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
    </Layout>
    )
  }
}

export default connect(
  state => ({user: state.user})
)(Admin);