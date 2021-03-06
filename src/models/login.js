//routerRedux 路由跳转
import { routerRedux } from 'dva/router';
//引入api接口
import {postAccount} from '@/services/api_2';
//引入公共组件
import { getPageQuery } from '@/utils/utils';
//引入公共组件
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    //错误信息
    message:undefined,
    //登录所获得的权限信息
    currentAuthority: [],
    //用户名
    currentUser:undefined,
  },

  effects: {
    //登录
    *login({ payload }, { call, put }) {
      const res = yield call(postAccount,payload)
      const { data } = res;
      if(data=="err"){
        yield put({ type: 'saveMessage', payload: { message: "账号或密码错误" } });
        return;
      }else{
      const {is_super}=data
      let authority = is_super ? ['superAdmin', 'admin'] : ['admin'];
      yield put({
        type: 'saveAccountInfo',
        payload: {
          // currentAuthority:currentAuthority,
          currentAuthority:authority,
          currentUser: payload.account,
        },
      });
      //如果权限信息正确，则跳转到/
        if(authority){
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          yield put(routerRedux.replace(redirect || '/'));
        }
      }
    },
    //  退出登录
    *logout(_, { put }) {
      yield put({
        type: 'saveAccountInfo',
        payload: {
          currentUser: undefined,
          currentAuthority: [],
        },
      });
      yield put({
        type: 'saveMessage',
        payload: {
          message: undefined,
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/login/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },
  

  reducers: {
    //更改state里面的message
    saveMessage(state, { payload }) {
      const { message } = payload;
      return {
        ...state,
        message,
      };
    },
    //保存state里面的用户信息和用户名
    saveAccountInfo(state,{payload}){
      //从payload中解构出权限信息和用户名
      const {currentAuthority,currentUser} =payload
      return {
        ...state,
        currentAuthority,
        currentUser
      }
    }
  },
};
