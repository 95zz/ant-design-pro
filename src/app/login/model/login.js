import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login } from '../service/login';
import { setAuthority } from 'core/utils/authority';
import { reloadAuthorized } from 'core/utils/Authorized';
import { getPageQuery } from 'core/utils/utils';
import { getUserMenu } from 'core/service/global';
import { moudleFormatter } from 'core/utils/DataHelper';
import cookie from 'react-cookies';
export default {
  namespace: 'login',

  state: {
    status: undefined,
    errorMsg: ''
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      let errorMsg = '';
      if (response && response.success) {

        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            type: payload.type,
            currentAuthority: 'admin'
          },
        });
        if(response.data.user.modules && response.data.user.modules.length >0){
          // 更新用户菜单状态
          yield put({
            type: 'global/updateState',
            payload: {
              currentUser: {
                name: response.data.user.name,
                avatar: response.data.user.avatar,
              },
              menus: moudleFormatter(response.data.user.modules)
            },
          });
        } else {
          errorMsg = '当前用户无权限';
        }
      } else {
        errorMsg = '用户名或密码错误';
      }

      // 登录失败处理
      if(errorMsg && errorMsg.length>0 ){
        errorMsg = response.statusText && '' !== response.statusText? response.statusText: errorMsg;

        yield put({
          type: 'changeLoginStatus',
          payload: {
            type: payload.type,
            status: 'error',
            errorMsg: errorMsg,
            currentAuthority: ''
          },
        });
      } else {
        console.info("response token is : " + response.data.token);
        // 保存token一天
        cookie.save('eva_token', response.data.token, {
          // 1 day
          maxAge: 60 * 60 * 24,
        });
        localStorage.setItem('eva_user', JSON.stringify(response.data.user));
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
    },
    *logout(_, { put }) {
      // 删除token
      cookie.remove('token');
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
