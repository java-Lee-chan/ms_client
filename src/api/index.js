import ajax from './ajax';

import downloadExcel from './download-excel';

const BASE = '';

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');

export const reqAddMeasure = (measure) => ajax(BASE + '/manage/measure/add', measure, 'POST');

export const reqGetMeasures = () => ajax(BASE + '/manage/measure/list');

export const reqUpdateMeasure = (measure) => ajax(BASE + '/manage/measure/update', measure, 'POST');

export const reqCheckId = (_id) => ajax(BASE + '/manage/measure/checkid', {_id}, 'POST');

export const reqUploadMeasures = (measures) => ajax(BASE + '/manage/measure/upload', {measures}, 'POST');

export const reqConfrimMeasures = (measures) => ajax(BASE + '/manage/measure/confirm', {measures}, 'POST');

export const reqDownloadMeasureTemplate = () => downloadExcel(BASE + '/manage/measure/downloadMeasureTemaplate');
