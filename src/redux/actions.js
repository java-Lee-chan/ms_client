import {
  RECEIVE_USER,
  RESET_USER,
  SHOW_ERROE_MSG,
  SET_HEAD_TITLE,
  // RECEIVE_METER_LEVELS,
  // ADD_METER_LEVEL,
  // UPDATE_METER_LEVEL,
  // DELETE_METER_LEVEL
} from './action-types';

import {
  reqLogin, 
  // reqGetMeterLevel, 
  // reqAddMeterLevel, 
  // reqUpdateMeterLevel, 
  // reqDeleteMeterLevel
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

// const receiverMeterLevels = (meterLevels) => ({type: RECEIVE_METER_LEVELS, data: meterLevels});

// export const asyncReceiverMeterLevels = () => {
//   return async dispatch => {
//     const result = await reqGetMeterLevel();
//     if(result.status === 0){
//       const meterLevels = result.data;
//       dispatch(receiverMeterLevels(meterLevels));
//     }
//   }
// }

// const addMeterLevel = (meterLevel) => ({type: ADD_METER_LEVEL, data: meterLevel});

// export const asyncAddMeterLevel = (newMeter) => {
//   return async dispatch => {
//     const result = await reqAddMeterLevel(newMeter);
//     if(result.status === 0){
//       const meterLevel = result.data;
//       dispatch(addMeterLevel(meterLevel));
//     }
//   }
// }

// const updateMeterLevel = (meterLevel) => ({type: UPDATE_METER_LEVEL, data: meterLevel});

// export const asyncUpdateMeterLevel = (newMeter) => {
//   return async dispatch => {
//     const result = await reqUpdateMeterLevel(newMeter);
//     if(result.status === 0){
//       const meterLevel = result.data;
//       console.log(meterLevel);
//       dispatch(updateMeterLevel(meterLevel));
//     }
//   }
// }

// const deleteMeterLevel = (_id) => ({type: DELETE_METER_LEVEL, data: _id});

// export const asyncDeleteMeterLevel = (_id) => {
//   return async dispatch => {
//     const result = await reqDeleteMeterLevel(_id);
//     if(result.result === 0){
//       dispatch(deleteMeterLevel(_id));
//     }
//   }
// }
