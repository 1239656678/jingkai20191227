import {
  queryListByregionsId,
  treeData,
  fakeSubmitForm,
  RemovesmsRegions,
  findRegionsById,
  dataList,
  update,
} from '../pages/deviceManagement/service';

const deviceManagement = {
  namespace: 'deviceManagement',
  state: {
    list: [],
    treeData: [],
    save: '',
    remove: {},
    findRegionsById: [],
    findAllList: [],
    updateCode: '',
  },
  effects: {
    *queryListByregionsId({ payload }, { call, put }) {
      const response = yield call(queryListByregionsId, payload);
      yield put({
        type: 'listresponse',
        payload: response,
      });
    },
    *treeData(_, { call, put }) {
      const response = yield call(treeData);
      yield put({
        type: 'tree',
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
    *dataListModel(_, { call, put }) {
      const response = yield call(dataList);
      yield put({
        type: 'listData',
        payload: response,
      });
    },
    *fakeSubmitForm({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(fakeSubmitForm, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *findRegionsById({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(findRegionsById, payload.id);
      yield put({
        type: 'findById',
        payload: response,
      });
    },
    *RemovesmsRegions({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(RemovesmsRegions, payload.id);
      yield put({
        type: 'remove',
        payload: response,
      });
    },
  },
  reducers: {
    listresponse(state, action) {
      return { ...state, list: action.payload.data };
    },
    tree(state, action) {
      return { ...state, treeData: action.payload.data };
    },
    listData(state, action) {
      return { ...state, findAllList: action.payload.data };
    },
    save(state, { payload }) {
      return { ...state, save: payload };
    },
    updateResult(state, action) {
      return { ...state, updateCode: action.payload.code };
    },
    findById(state, { payload }) {
      return { ...state, findRegionsById: payload.data };
    },
    remove(state, { payload }) {
      return { ...state, remove: payload };
    },
  },
};
export default deviceManagement;
