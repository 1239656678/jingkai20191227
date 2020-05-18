import { stringify } from 'querystring';
import router from 'umi/router';
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { getCookie, delCookie, setCookie, setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { findCurrentMenu } from '@/services/user';
const Model = {
  namespace: 'login',
  state: {
    code: '',
    list: [],
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully
      if (response.code === 0) {
        setCookie('userName', payload.username);
        setCookie(payload.username, response.data.access_token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        message.success('登录成功');
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/index';
            return;
          }
        }
        router.replace('/index');
      } else {
        message.error('用户名或密码错误');
      }
    },
    //获取菜单
    *findCurrentMenu(_, { call, put }) {
      let username = getCookie('userName');
      let token = getCookie(username);
      // console.log(token)
      const response = yield call(findCurrentMenu, 'Bearer ' + token);
      let arrs = response.data;
      testFun(arrs);
      // console.log("arr=======3333",arrs)

      function testFun(arrs) {
        arrs &&
          arrs.map(item => {
            item['key'] = item.id;
            if (item.areaId != null) {
              item.children.map(item => {
                item['path'] = item.path + '/' + item.areaId;
              });
            }
            if (item.children != []) {
              testFun(item.children);
            }
          });
      }
      yield put({
        type: 'getMenu',
        payload: response.data,
      });
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    getMenu(state, payload) {
      return {
        list: payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      setAuthority('admin');
      return { ...state, code: payload.code, type: payload.type };
    },
  },
};
export default Model;
