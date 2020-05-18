import { queryRule,saveRole,setbindMenus,getBindMenus,getAllMenuList,deleteRole,updateRole} from '../../pages/systemManage/rolemanage/service';

const roleManage = {
  namespace: 'rolemanage',
  state: {
    list: {},
    saveCode:[],
    removeResult:[],
    bindCode:[],
    menuList:[],
    getAllMenuDate:[],
    updateCode:[]
  },
  effects: {
    *getPatroPlanList({payload}, { call, put }) {
      const response = yield call(queryRule,payload);
      yield put({
        type: 'initList',
        payload: response,
      });
    },
    *getMenu({payload}, { call, put }) {
      const response = yield call(getBindMenus, payload.id);
      yield put({
        type: 'menu',
        payload: response,
      });
    },
    *AllMenu(_, { call, put }) {
      const response = yield call(getAllMenuList);
      yield put({
        type: 'allMenu',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
      const response = yield call(saveRole,payload);
      yield put({
        type: 'saveResult',
        payload: response,
      });
    },
    *updateData({payload}, { call, put }) {
      const response = yield call(updateRole,payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *bindMenuList({payload}, { call, put }) {
      const response = yield call(setbindMenus,payload);
      yield put({
        type: 'bindmenu',
        payload: response,
      });
    },   
    *RemoveRole({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload.id);
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
    allMenu(state, action) {
      return { ...state, getAllMenuDate: action };
    },
    menu(state, action) {
      return { ...state, menuList: action.payload.data };
    },
    bindmenu(state, action) {
      return { ...state, bindCode: action };
    },
    updateResult(state, action) {
      return { ...state, updateCode: action };
    },
    remove(state, { payload }) {
      return { ...state, removeResult: payload };
    },
  },
};
export default roleManage;
