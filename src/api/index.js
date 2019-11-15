import ajax from './ajax';

const BASE = '';

export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST');
