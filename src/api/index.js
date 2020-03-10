import ajax from './ajax';
import jsonp from 'jsonp';
import downloadExcel from './download-excel';

import { message } from 'antd';

const BASE = '';

// 请求登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

// 新增测量仪器
export const reqAddMeasure = (measure) => ajax(BASE + '/manage/measure/add', measure, 'POST');

// 获取测量仪器列表
export const reqGetMeasures = () => ajax(BASE + '/manage/measure/list');

// 获取最近一段时间到期的测量仪器列表
export const reqGetRecentMeasures = () => ajax(BASE + '/manage/measure/recent/list');

// 更新测量仪器
export const reqUpdateMeasure = (measure) => ajax(BASE + '/manage/measure/update', measure, 'POST');

// 检查 id 是否重复
export const reqCheckId = (_id) => ajax(BASE + '/manage/measure/checkid', {_id}, 'POST');

// 上传测量仪器
export const reqUploadMeasures = (measures) => ajax(BASE + '/manage/measure/upload', {measures}, 'POST');

// 确认测量仪器
export const reqConfrimMeasures = (measures) => ajax(BASE + '/manage/measure/confirm', {measures}, 'POST');

// 请求下载模板
export const reqDownloadTemplate = (type) => downloadExcel(BASE + '/manage/downloadTemplate', {type});

// 获取备件列表
export const reqGetSpareParts = (start, end, committer) => ajax(BASE + '/manage/spare-part/list', {start, end, committer});

// 新增备件
export const reqAddSparePart = (sparePart) => ajax(BASE + '/manage/spare-part/add', sparePart, 'POST');

// 更新备件
export const reqUpdateSparePart= (sparePart) => ajax(BASE + '/manage/spare-part/update', sparePart, 'POST');

// 上传备件
export const reqUploadSpareParts = (spareParts) => ajax(BASE + '/manage/spare-part/upload', {spareParts}, 'POST');

// 确认备件
export const reqConfirmSpareParts = (spareParts) => ajax(BASE + '/manage/spare-part/confirm', {spareParts}, 'POST');

// 获取这个月的备件
export const reqSparePartTime = () => ajax(BASE + '/manage/spare-part/recent/list');

// 新增角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST');

// 获取角色列表
export const reqGetRoles = () => ajax(BASE + '/manage/role/list');

// 更新角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST');

// 获取用户列表
export const reqGetUsers = () => ajax(BASE + '/manage/user/list');

// 更新或者新增用户
export const reqAddOrUpdate = (user) => ajax(BASE + `/manage/user/${user._id? 'update':'add'}`, user, 'POST');

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST');

/* 
jsonp请求的接口请求函数 
`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
*/
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      // console.log(err, data);
      // 如果成功
      if(!err && data.status === 'success'){
        // 取出需要的数据
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather});
      }else {
        // 如果失败
        message.error('获取天气信息失败');
      }
    })
  })
}

// 获取能源表层级
export const reqGetMeterLevel = () => ajax(BASE + '/manage/meter-level/list');

// 新增表层级
export const reqAddMeterLevel = (meter) => ajax(BASE + '/manage/meter-level/add', meter, 'POST');

// 更新表层级
export const reqUpdateMeterLevel = (meter) => ajax(BASE + '/manage/meter-level/update', meter, 'POST');

// 删除表层级
export const reqDeleteMeterLevel = (_id) => ajax(BASE + '/manage/meter-level/delete', {_id}, 'POST');