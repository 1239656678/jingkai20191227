import { queryRule, save, remove, update } from '../pages/classification/service';

const classiFicationModel = {
  namespace: 'classification',
  state: {
    list: {},
    saveCode: '',
    removeResult: '',
    updateCode: '',
  },
  effects: {
    *classificationList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'classificationDataList',
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
    *updateData({ payload }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *deleteData({ payload }, { call, put }) {
      console.log('payload=====', payload);
      const response = yield call(remove, payload.id);
      yield put({
        type: 'remove',
        payload: response,
      });
    },
  },
  reducers: {
    classificationDataList(state, action) {
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
export default classiFicationModel;
