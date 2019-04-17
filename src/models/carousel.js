//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {
  getcarousel,addcarousel,delecarousel,updatecarousel
} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'carousel',

  state: {
    list:[],
  },

  effects: {
    //获取轮播信息
    *getInfo(_,{call,put}){
      // let {data}=yield call(getcarousel)
      let {data}=yield call(getcarousel)
      yield put ({
        type:'saveInfo',payload:data
      })
    },
    //轮播管理 添加轮播
    *addcarousel({payload},{call,put,select}){
      let {list} = yield select(state => state.carousel);
      let  data = yield call(addcarousel, payload);
      if(data){
        yield put({ type: 'getInfo', payload: list});
        message.success('添加成功');
      }else{
        message.success('添加失败');
      }
    },
     //编辑
    *updatecarousel({payload},{call,put,select}){
      const { list } = yield select(state => state.carousel);
      const {data}= yield call(updatecarousel, payload);
      if(data){
        message.success('编辑成功');
        yield put({ type: 'getInfo' });
      }
    },
    //删除
    *delecarousel({payload,callback},{call,put,select}){
      const {key} = payload
      yield delecarousel(state => state.carousel);
      yield call(delecarousel, key[0]);
      message.success('删除成功');
      yield put({ type: 'getInfo' });
      callback();
    },
    // //推荐商品
    // *changeRecommend({ payload }, { call, put }) {
    //  let n= yield call(changeRecommend, payload);
    //   yield put({ type: 'getProduct' });
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