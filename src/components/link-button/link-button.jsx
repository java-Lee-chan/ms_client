import React from 'react';
import './link-button.less';

// 高阶组件包装button
export default function LinkButton(props) {
  return (
    <button {...props} className="link-button"></button>
  )
}