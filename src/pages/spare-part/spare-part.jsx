import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import SparePartHome from './spare-part-home';
import SparePartAddUpdate from './add-update';
import SparePartUpload from './spare-part-upload';

export default class SparePart extends Component {

  render() {
    return (
      <Switch>
        <Route path='/spare-part' component={SparePartHome} exact/>
        <Route path='/spare-part/addupdate' component={SparePartAddUpdate}/>
        <Route path='/spare-part/upload' component={SparePartUpload}/>
        <Redirect to='/spare-part'/>
      </Switch>
    )
  }
}