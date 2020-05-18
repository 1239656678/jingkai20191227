import { queryRule,saveDataList,updateDataList,removeDataList} from '../../pages/systemManage/dataList/service';

const dataListManage = {
  namespace: 'dataListManage',
  state: {
    datalist: [],
    saveList:'',
    updateList:'',
    removeList:''
  },
  effects: {
    *getDataList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
        const response = yield call(saveDataList,payload);
        yield put({
          type: 'save',
          payload: response,
        });
    },
    *updateData({payload}, { call, put }) {
        const response = yield call(updateDataList,payload);
        yield put({
          type: 'update',
          payload: response,
        });
      },
    *deleteData({ payload }, { call, put }) {
        const response = yield call(removeDataList, payload.id);
        yield put({
          type: 'remove',
          payload: response,
        });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, datalist: action };
    },
    save(state, action) {
        return { ...state, saveList: action };
    },
    update(state, action) {
        return { ...state, updateList: action };
    },
    remove(state, action) {
        return { ...state, removeList: action };
    },
  },
};
export default dataListManage;
