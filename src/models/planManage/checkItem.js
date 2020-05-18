import {
  queryList,
  save,
  deletePlan,
  update,
  bindTargets,
  getbindTargets,
  removeBindTargets,
} from '../../pages/planManage/checkItem/service';

const patroPlan = {
  namespace: 'checkItem',
  state: {
    list: {},
    saveCode: [],
    removeResult: [],
    updateCode: '',
    bindResultCode: '',
    bindResultGetCode: '',
    removeTargetResult: '',
  },
  effects: {
    *getPatroPlanList(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'initList',
        payload: response,
      });
    },
    //绑定设备
    *postBindTargets({ payload }, { call, put }) {
      const response = yield call(bindTargets, payload);
      yield put({
        type: 'bindResult',
        payload: response,
      });
    },
    //获取绑定设备类型
    *getBindTargetsById({ payload }, { call, put }) {
      const response = yield call(getbindTargets, payload);
      console.log('getbind', response);
      yield put({
        type: 'bindResultByGet',
        payload: response,
      });
    },
    *updateData({ payload }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *saveData({ payload }, { call, put }) {
      const response = yield call(save, payload);
      yield put({
        type: 'saveResult',
        payload: response,
      });
    },
    //删除绑定项
    *RemoveBindTargets({ payload }, { call, put }) {
      const response = yield call(removeBindTargets, payload);
      yield put({
        type: 'removeTargets',
        payload: response,
      });
    },
    *RemoveCheckItem({ payload }, { call, put }) {
      const response = yield call(deletePlan, payload.id);
      yield put({
        type: 'remove',
        payload: response,
      });
    },
  },
  reducers: {
    initList(state, action) {
      return { ...state, list: action.payload };
    },
    saveResult(state, action) {
      return { ...state, saveCode: action };
    },
    bindResult(state, action) {
      return { ...state, bindResultCode: action };
    },
    bindResultByGet(state, action) {
      return { ...state, bindResultGetCode: action };
    },
    updateResult(state, action) {
      return { ...state, updateCode: action.payload.code };
    },
    removeTargets(state, { payload }) {
      return { ...state, removeTargetResult: payload };
    },
    remove(state, { payload }) {
      return { ...state, removeResult: payload };
    },
  },
};
export default patroPlan;
