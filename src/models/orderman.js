//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {
  getOrder,condition
} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'orderman',

  state: {
    list:[],

  },

  effects: {
    //获取
    *getInfo(_,{call,put}){
      let {data}=yield call(getOrder)
      yield put ({
        type:'saveInfo',payload:data
      })
    },

    //状态
    *condition({ payload }, { call, put }) {
     let n= yield call(condition, payload);
      yield put({ type: 'getInfo' });
    },
  },

  reducers: {
   //list
    saveInfo(state,{payload}){
      return {
        ...state,
        list:payload
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({type: 'getInfo'});
    },
  },
};