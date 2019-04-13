//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {
  management,delemanage
} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'management',

  state: {
    list:[],
    
  },

  effects: {
    //获取用户信息
    *getInfo(_,{call,put}){
      let {data}=yield call(management)
      yield put ({
        type:'saveInfo',payload:data
      })
    },
    //删除商品分类
    *deleteitem({payload,callback},{call,put,select}){
      const {key} = payload
      yield select(state => state.product);
      yield call(delemanage, key[0]);
      message.success('删除成功');
      yield put({ type: 'getInfo' });
      callback();
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