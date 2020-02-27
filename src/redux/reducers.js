import {combineReducers} from 'redux';
import {
  RECEIVE_USER,
  SHOW_ERROE_MSG,
  RESET_USER,
  SET_HEAD_TITLE,
  // GET_METERLEVELS,
  // ADD_METERLEVELS,
  // UPDATE_METERLEVELS,
  // DELETE_METERLEVELS
} from './action-types';

import storageUtils from '../utils/storageUtils';

const initUser = storageUtils.getUser();
// 处理用户信息
function user(state=initUser, action){
  switch(action.type){
    case RECEIVE_USER: 
      return action.data
    case SHOW_ERROE_MSG:
      return {...state, msg: action.data}
    case RESET_USER:
      return {}
    default:
      return state
  }
}

const initHeadTitle = '首页';
// 处理header中的标题
function headTitle(state=initHeadTitle, action){
  switch(action.type){
    case SET_HEAD_TITLE:
      return action.data
    default: 
      return state
  }
}

// const initMeterLevels = [];

// function meterLevels(state=initMeterLevels, action) {
//   switch(action.type){
//     case GET_METERLEVELS:
//       return action.data
//     case ADD_METERLEVELS:
//       return [...state, action.data]
//     case UPDATE_METERLEVELS:
//       const newState = state.map(item => {
//         if(item._id === action.data._id) {
//           return action.data
//         } else {
//           return item
//         }
//       });
//       return newState
//     case DELETE_METERLEVELS:
//       return state.filter(item => item._id !== action.data._id)
//     default:
//       return state
//   }
// }

export default combineReducers({
  user, 
  headTitle,
  // meterLevels
});