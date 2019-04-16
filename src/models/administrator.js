//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {
  postAdmin,getAdmin,setSuper,compile,deleAdmin
} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'administrator',

  state: {
    list:[],
  },

  effects: {
    //获取
    *getInfo(_,{call,put}){
      let {data}=yield call(getAdmin)
      yield put ({
        type:'saveInfo',payload:data
      })
    },
    //添加
    *postAdmin({ payload }, { call, put, select }) {
      let { list } = yield select(state => state.administrator);
      const { data } = yield call(postAdmin, payload);
      yield put({ type: 'getInfo'})
    },
    //编辑
    *compile({payload},{call,put}){
      yield call(compile, payload);
      yield put({ type: 'getInfo' })
    },
    //删除
    *deleAdmin({payload,callback},{call,put,select}){
      const {key} = payload
      yield select(state => state.administrator);
      yield call(deleAdmin, key[0]);
      message.success('删除成功');
      yield put({ type: 'getInfo' });
      callback();
    },
    //设置超级管理员
    *setSuper({ payload }, { call, put }) {
     let n= yield call(setSuper, payload);
      yield put({ type: 'getInfo' });
    },
    // //上下架
    // *changeShift({ payload }, { call, put }) {
    //   yield call(changeShift, payload);
    //   yield put({ type: 'getLists' });
    // },
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