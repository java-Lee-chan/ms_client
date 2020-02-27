import {
  RECEIVE_USER,
  RESET_USER,
  SHOW_ERROE_MSG,
  SET_HEAD_TITLE,
  // GET_METERLEVELS,
  // ADD_METERLEVELS,
  // UPDATE_METERLEVELS,
  // DELETE_METERLEVELS
} from './action-types';

import {
  reqLogin, 
  // reqGetMeterLevel, reqAddMeterLevel, reqUpdateMeterLevel, reqDeleteMeterLevel
} from '../api';

import storageUtils from '../utils/storageUtils';

const receiveUser = (user) => ({type: RECEIVE_USER, data: user});

export const logout = () => {
  storageUtils.removeUser();
  return {type: RESET_USER};
}

export const showErrorMsg = (msg) => ({type: SHOW_ERROE_MSG, data: msg});

export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle});

// export const getMeterLevels = (meterLevels) => ({type: GET_METERLEVELS, data: meterLevels});

// export const addMeterLevels = (meterLevel) => ({type: ADD_METERLEVELS, data: meterLevel});

// export const deleteMeterLevels = (meterLevel) => ({type: DELETE_METERLEVELS, data: meterLevel});

// export const updateMeterLevels = (meterLevel) => ({type: UPDATE_METERLEVELS, data: meterLevel});

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

// export const asyncGetMeterLevels = () => {
//   return async dispatch => {
//     const result = await reqGetMeterLevel();
//     if(result.status === 0) {
//       const meterLevels = result.data;
//       dispatch(getMeterLevels(meterLevels));
//     }else {
//       const msg = result.msg;
//       dispatch(showErrorMsg(msg));
//     }
//   }
// }

// export const asyncAddMeterLevels = (newMeter) => {
//   return async dispatch => {
//     const result = await reqAddMeterLevel(newMeter);
//     if(result.status === 0) {
//       const meterLevel = result.data;
//       dispatch(addMeterLevels(meterLevel));
//     }else {
//       const msg = result.msg;
//       dispatch(showErrorMsg(msg));
//     }
//   }
// }

// export const asyncUpdateMeterLevels = (newMeter) => {
//   return async dispatch => {
//     const result = await reqUpdateMeterLevel(newMeter);
//     if(result.status === 0) {
//       // const meterLevel = result.data;
//       dispatch(updateMeterLevels(newMeter));
//     }else {
//       const msg = result.msg;
//       dispatch(showErrorMsg(msg));
//     }
//   }
// }

// export const asyncDeleteMeterLevels = (id) => {
//   return async dispatch => {
//     const result = await reqDeleteMeterLevel(id);
//     if(result.status === 0) {
//       // const meterLevel = result.data;
//       dispatch(deleteMeterLevels(id));
//     }else {
//       const msg = result.msg;
//       dispatch(showErrorMsg(msg));
//     }
//   }
// }
