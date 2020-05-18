import { queryRule,Remove} from '../../pages/DangerManage/ListTableList/service';

const RepairList = {
  namespace: 'repairList',
  state: {
    Repairlist: [],
    saveCode:'',
    removeResult:''
  },
  effects: {
    *getRepairList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    // *saveData({payload}, { call, put }) {
    //     const response = yield call(saveMenu,payload);
    //     yield put({
    //       type: 'saveResult',
    //       payload: response,
    //     });
    // },
    *deleteData({ payload }, { call, put }) {
        const response = yield call(Remove, payload.id);
        yield put({
          type: 'remove',
          payload: response,
        });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, Repairlist: action };
    },
    // saveResult(state, action) {
    //     return { ...state, saveCode: action };
    // },
    remove(state, { payload }) {
        return { ...state, removeResult: payload };
    },
   
  },
};
export default RepairList;
