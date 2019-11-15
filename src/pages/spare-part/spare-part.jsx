import React, {Component} from 'react';

import {Input} from 'antd';

import XlsxToJson from '../../utils/xlsx-to-json';
import formatDate from '../../utils/format-excel-date';
import {measureConstants} from '../../utils/constants';

export default class SparePart extends Component {

  handleChange = (e) => {
    XlsxToJson(e.target.files[0], (json) => {
      console.log(json);
      const measures = json.reduce((pre, item) => {
        Object.keys(measureConstants).forEach(key => {
          pre[key] = item[measureConstants[key]];
        })
        return pre;
      }, []);
      console.log(measures); 
    });
  }
  render() {
    return (
      <Input type="file" onChange={this.handleChange}/>
    )
  }
}