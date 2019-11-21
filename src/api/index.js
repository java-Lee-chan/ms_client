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

export const reqDownloadTemplate = (type) => downloadExcel(BASE + '/manage/downloadTemplate', {type});

export const reqGetSpareParts = (start, end, commiter) => ajax(BASE + '/manage/spare-part/list', {start, end, commiter});

export const reqAddSparePart = (sparePart) => ajax(BASE + '/manage/spare-part/add', sparePart, 'POST');

export const reqUpdateSparePart= (sparePart) => ajax(BASE + '/manage/spare-part/update', sparePart, 'POST');

export const reqUploadSpareParts = (spareParts) => ajax(BASE + '/manage/spare-part/upload', {spareParts}, 'POST');

export const reqConfirmSpareParts = (spareParts) => ajax(BASE + '/manage/spare-part/confirm', {spareParts}, 'POST');

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST');

export const reqGetRoles = () => ajax(BASE + '/manage/role/list');

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST');

export const reqGetUsers = () => ajax(BASE + '/manage/user/list');

export const reqAddOrUpdate = (user) => ajax(BASE + `/manage/user/${user._id? 'update':'add'}`, user, 'POST');

export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST');