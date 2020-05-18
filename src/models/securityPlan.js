import { queryRule,save,deletePlan,update } from '../pages/planManage/securityPlan/service';

const securityPlan = {
  namespace: 'securityPlan',
  state: {
    list: {},
    saveCode:[],
    removeResult:[],
    updateCode:''
  },
  effects: {
    *getPatroPlanList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'initList',
        payload: response,
      });
    },
    *updateData({payload}, { call, put }) {
      const response = yield call(update,payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
      const response = yield call(save,payload);
      yield put({
        type: 'saveResult',
        payload: response,
      });
    },
    *RemoveCheckItem({ payload }, { call, put }) {
      console.log(payload);
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
    updateResult(state, action) {
      return { ...state, updateCode: action.payload.code };
    },
    remove(state, { payload }) {
      return { ...state, removeResult: payload };
    },
  },
};
export default securityPlan;
