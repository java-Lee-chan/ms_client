import {combineReducers} from 'redux';
import {
  RECEIVE_USER,
  SHOW_ERROE_MSG,
  RESET_USER,
  SET_HEAD_TITLE,
  // RECEIVE_METER_LEVELS,
  // ADD_METER_LEVEL,
  // UPDATE_METER_LEVEL,
  // DELETE_METER_LEVEL
} from './action-types';

import storageUtils from '../utils/storageUtils';

const initUser = storageUtils.getUser();

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

function headTitle(state=initHeadTitle, action){
  switch(action.type){
    case SET_HEAD_TITLE:
      return action.data
    default: 
      return state
  }
}

// const initMeterLevels = [];

// function meterLevels(state=initMeterLevels, action){
//   switch(action.type){
//     case RECEIVE_METER_LEVELS:
//       return action.data;
//     case ADD_METER_LEVEL:
//       console.log(state, action.data);
//       return [...state, action.data];
//     case UPDATE_METER_LEVEL:
//       return state.map((meterLevel) => (meterLevel._id === action.data)? action.data: meterLevel);
//     case DELETE_METER_LEVEL:
//       console.log(action.data, state);
//       return state.filter((meterLevel) => (meterLevel._id !== action.data && meterLevel.father_id !== action.data));
//     default:
//       return state;
//   }
// }

export default combineReducers({
  user, 
  headTitle,
  // meterLevels
});