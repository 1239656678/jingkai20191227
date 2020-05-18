import { queryCurrent, query ,findCurrentMenu } from '@/services/user';
import {getCookie} from "@/utils/authority";

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    findCurrentMenu:[],
  },
  effects: {


    *fetchCurrent(_, { call, put }) {
      let username = getCookie('userName');
      let token = getCookie(username);
      const response = yield call(queryCurrent,'Bearer ' + token);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },


    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
