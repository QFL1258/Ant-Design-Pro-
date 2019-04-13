//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {
  product,addproduct,saveredact,deleteredact,getproduct,postProduct,saveitem,deleteitem,
  changeRecommend
} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
export default {
  namespace: 'product',

  state: {
    list:[],
    productList:[],
  },

  effects: {
    //获取商品分类
    *getInfo(_,{call,put}){
      let {data}=yield call(product)
      yield put ({
        type:'saveInfo',payload:data
      })
    },
    //添加商品分类
    *addProduct({ payload }, { call, put, select }) {
      let { list } = yield select(state => state.product);
      const { data } = yield call(addproduct, payload);
      yield put({ type: 'getInfo'})
    },
    //编辑商品分类
    *saveredact({payload},{call,put}){
      yield call(saveredact, payload);
      yield put({ type: 'getInfo' })
    },
    //删除商品分类
    *deleteredact({payload,callback},{call,put,select}){
      const {key} = payload
      yield select(state => state.product);
      yield call(deleteredact, key[0]);
      message.success('删除成功');
      yield put({ type: 'getInfo' });
      callback();
    },
    //商品管理获取
    *getProduct(_,{call,put}){
      const {data} =yield call(getproduct)
      console.log(data)
      yield put({
        type:'saveProduct',payload:data
      })
    },
    //商品管理 添加商品
    *postProduct({payload},{call,put,select}){
      let {productList} = yield select(state => state.product);
      let  data = yield call(postProduct, payload);
      message.success('添加成功');
      yield put({ type: 'getProduct', payload: productList});
    },
    //商品管理 编辑商品
    *saveitem({payload},{call,put,select}){
      const { productList } = yield select(state => state.product);
      const {data}= yield call(saveitem, payload);
      if(data){
        message.success('编辑成功');
        yield put({ type: 'getProduct' });
      }
    },
    //商品管理 删除商品
    *deleteitem({payload,callback},{call,put,select}){
      const {key} = payload
      yield select(state => state.product);
      yield call(deleteitem, key[0]);
      message.success('删除成功');
      yield put({ type: 'getProduct' });
      callback();
    },
    //推荐商品
    *changeRecommend({ payload }, { call, put }) {
     let n= yield call(changeRecommend, payload);
      yield put({ type: 'getProduct' });
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
   //productList
   saveProduct(state,{payload}){
    return {
      ...state,
      productList:payload
    }
   }
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch({type: 'getInfo'});
      dispatch({type:'getProduct'})
    },
  },
};