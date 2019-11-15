import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import MeasureHome from './measure-home';
import MeasureAddUpdate from './add-update';

export default class Measure extends Component {
  render() {
    return (
      <Switch>
        <Route path='/measure' component={MeasureHome} exact/>
        <Route path="/measure/addupdate" component={MeasureAddUpdate}/>
        <Redirect to='/measure'/>
      </Switch>
    )
  }
}