import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import MeasureHome from './measure-home';
import MeasureAddUpdateAndDetail from './add-update-detail';
import MeasureUpload from './upload-measures';

export default class Measure extends Component {
  render() {
    return (
      <Switch>
        <Route path='/measure' component={MeasureHome} exact/>
        <Route path="/measure/addupdate" component={MeasureAddUpdateAndDetail}/>
        <Route path="/measure/upload" component={MeasureUpload}/>
        <Redirect to='/measure'/>
      </Switch>
    )
  }
}