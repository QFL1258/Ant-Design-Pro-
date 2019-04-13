//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {personal,edit,deletepersonal,selectpersonal} from '@/services/api';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'personal',

  state: {
    list:[],
    selectlist:[],
  },

  effects: {
    //获取信息
   *getInfo(_,{call,put}){
    let list=yield call(personal)
    yield put ({
      type:'saveInfo',payload:list
    })
   },
    //保存
   *savepersonal({ payload }, { call, put }) {
    yield call(edit, payload);
    yield put({ type: 'getInfo' });
   },
   //删除
   *deletepersonal({payload,callback},{call,put,select}){
     const {key} = payload
     yield select(state => state.resources_folder);
     yield call(deletepersonal, key[0]);
     message.success('删除成功');
     yield put({ type: 'getInfo' });
     callback();
   },
   //下拉选
   *selectlist(_,{call,put}){
     let selectlist=yield call(selectpersonal)
     yield put ({
      type:'saveselectlist',payload:selectlist
     })
   }
  },

  reducers: {
    //list
    saveInfo(state,{payload}){
      return {
        ...state,
        list:payload
      }
    },
    //selectlist
    saveselectlist(state,{payload}){
      return {
        ...state,
        selectlist:payload
      }
    }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({type: 'getInfo'});
      dispatch({type:'selectlist'})
    },
  },
};