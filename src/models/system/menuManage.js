import { queryRule,saveMenu,deleteMenu} from '../../pages/systemManage/menumanage/service';

const menuManage = {
  namespace: 'menumanage',
  state: {
    Menulist: [],
    saveCode:'',
    removeResult:''
  },
  effects: {
    *sysgetMenuList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
        const response = yield call(saveMenu,payload);
        yield put({
          type: 'saveResult',
          payload: response,
        });
    },
    *deleteMenuData({ payload }, { call, put }) {
        console.log(payload);
        const response = yield call(deleteMenu, payload.id);
        yield put({
          type: 'remove',
          payload: response,
        });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, Menulist: action };
    },
    saveResult(state, action) {
        return { ...state, saveCode: action };
    },
    remove(state, { payload }) {
        return { ...state, removeResult: payload };
    },
   
  },
};
export default menuManage;
