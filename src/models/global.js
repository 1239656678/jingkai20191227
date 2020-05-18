import {
  findCurrentMenu,
  queryNotices,
  getindexData,
  getHeaderData,
  fetchBarList,
  fetchDangerCheckResult,
} from '@/services/user';
import { getCookie, delCookie } from '@/utils/authority';
const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    menuData: [],
    fetchPieList: [], //首页饼状图
    fetchHeaderList: '',
    fetchBarData: [], //柱状图
    fetchDangerCheckDataList: [], //隐患检测
  },
  effects: {
    //获取菜单
    *findCurrentMenu(_, { call, put }) {
      let username = getCookie('userName');
      let token = getCookie(username);
      const response = yield call(findCurrentMenu, 'Bearer ' + token);
      yield put({
        type: 'getMenu',
        payload: response.data,
      });
    },
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    /********************首页******************/

    //首页头部
    *fetchHeadDataList(_, { call, put }) {
      const response = yield call(getHeaderData);
      yield put({
        type: 'headerData',
        payload: response,
      });
    },

    //饼状图
    *findIndexData(_, { call, put }) {
      const response = yield call(getindexData);
      yield put({
        type: 'indexData',
        payload: response,
      });
    },

    //首页柱状图
    *fetchBarDataResult(_, { call, put }) {
      const response = yield call(fetchBarList);
      yield put({
        type: 'barData',
        payload: response,
      });
    },

    // //首页隐患检测
    *fetchDangerCheck(_, { call, put }) {
      const response = yield call(fetchDangerCheckResult);
      yield put({
        type: 'fetchBottomData',
        payload: response,
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    getMenu(state, payload) {
      return {
        menuData: payload,
      };
    },
    //首页饼状图
    indexData(state, payload) {
      return {
        fetchPieList: payload,
      };
    },
    //首页柱状图
    barData(state, payload) {
      return {
        fetchBarData: payload,
      };
    },
    headerData(state, payload) {
      return {
        fetchHeaderList: payload,
      };
    },
    //隐患检测
    fetchBottomData(state, payload) {
      return {
        fetchDangerCheckDataList: payload,
      };
    },

    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        let username = getCookie('userName');
        let token = getCookie(username);
        if (token !== null) {
          if (typeof window.ga !== 'undefined') {
            window.ga('send', 'pageview', pathname + search);
          }
        } else {
          return history.push('/user/login');
        }
      });
    },
  },
};
export default GlobalModel;
