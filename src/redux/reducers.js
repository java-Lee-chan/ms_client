import {combineReducers} from 'redux';
import {
  RECEIVE_USER,
  SHOW_ERROE_MSG,
  RESET_USER,
  SET_HEAD_TITLE,
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

export default combineReducers({
  user, 
  headTitle
});