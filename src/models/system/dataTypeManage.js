import { queryTypeRule,saveDataTypeList,updateDataTypeList,removeDataTypeList} from '../../pages/systemManage/dataList/service';

const dataTypeListManage = {
  namespace: 'dataTypeListManage',
  state: {
    dataTypelist: [],
    saveTypeList:'',
    updateTypeList:'',
    removeTypeList:''
  },
  effects: {
    *getDataList(_, { call, put }) {
      const response = yield call(queryTypeRule);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
        const response = yield call(saveDataTypeList,payload);
        yield put({
          type: 'save',
          payload: response,
        });
    },
    *updateData({payload}, { call, put }) {
        const response = yield call(updateDataTypeList,payload);
        yield put({
          type: 'update',
          payload: response,
        });
      },
    *deleteData({ payload }, { call, put }) {
        const response = yield call(removeDataTypeList, payload.id);
        yield put({
          type: 'remove',
          payload: response,
        });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, dataTypelist: action };
    },
    save(state, action) {
        return { ...state, saveTypeList: action };
    },
    update(state, action) {
        return { ...state, updateTypeList: action };
    },
    remove(state, action) {
        return { ...state, removeTypeList: action };
    },
  },
};
export default dataTypeListManage;
