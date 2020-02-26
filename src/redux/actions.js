import {
  RECEIVE_USER,
  RESET_USER,
  SHOW_ERROE_MSG,
  SET_HEAD_TITLE
} from './action-types';

import {
  reqLogin,
} from '../api';

import storageUtils from '../utils/storageUtils';

const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

export const logout = () => {
  storageUtils.removeUser();
  return {type: RESET_USER};
}

export const showErrorMsg = (msg) => ({type: SHOW_ERROE_MSG, data: msg});

export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle});

// 登录的异步action
export const login = (username, password) => {
  return async dispatch => {
    const result = await reqLogin(username, password);
    if(result.status === 0){
      const user = result.data;
      storageUtils.saveUser(user);
      dispatch(receiveUser(user));
    }else {
      const msg = result.msg;
      dispatch(showErrorMsg(msg));
    }
  }
};

