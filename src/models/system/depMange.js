import { treeListDate,findUserByOrganizationId,queryCompanyList,getOrganizationsById,saveDep,removeDep,updateDept,bindOrganizationUser,findOrganizationUser,removeOrganizationUser} from '../../pages/systemManage/depManage/service';

const depMange = {
  namespace: 'depMange',
  state: {
    getList: {},
    getUserListByOrganizationId:[],
    companyListArray:[],
    initCompanyOrganizationsList:[],
    saveCode:'',
    removeResult:'',
    updateCode:'',
    OrganizationUserResult:'',//获取部门领导人
    setBindOrganizationUserResult:'',//绑定部门领导人
    removeOrganizationUserResult:'' //移除部门领导人
  },
  effects: {
    *treeListDate(_, { call, put }) {
      const response = yield call(treeListDate);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *saveData({payload}, { call, put }) {
      const response = yield call(saveDep,payload);
      yield put({
        type: 'saveResult',
        payload: response,
      });
    },
    // 查询单位列表(数组格式)
    * queryCompanyListArray({ payload }, { call, put }) {
      const rsp = yield call(queryCompanyList, payload);
      yield put({ type: 'initCompanyListArray', payload: rsp.data.content });
    },
     // 根据单位ID查询组织机构列表
     * getOrganizationsById({ payload }, { call, put }) {
      const rsp = yield call(getOrganizationsById, payload);
      yield put({ type: 'initCompanyOrganizationsList', payload: rsp.data });
    },
    //获取组织机构下的所有用户
    *findUserByOrganizationId({payload}, { call, put }) {
      const response = yield call(findUserByOrganizationId,payload.id);
      yield put({
        type: 'getUserListByOrganizationId',
        payload: response,
      });
    },
    *updateData({payload}, { call, put }) {
      const response = yield call(updateDept,payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *deleteDepData({ payload }, { call, put }) {
      const response = yield call(removeDep, payload.id);
      yield put({
        type: 'remove',
        payload: response,
      });
    },
     //获取组织领导人
     *getOrganizationUserById({payload}, { call, put }) {
      const response = yield call(findOrganizationUser,payload);
      yield put({
        type: 'getOrganizationUserByIdReducers',
        payload: response,
      });
    },
    //绑定领导人
     * bindOrganizationUser({ payload }, { call, put }) {
      const response = yield call(bindOrganizationUser, payload);
      yield put({ type: 'BindOrganizationUser', payload: response });
    },
    //移除部门领导人 removeOrganizationUser
    *deletOrganizationUser({ payload }, { call, put }) {
      const response = yield call(removeOrganizationUser, payload);
      yield put({
        type: 'removeOrganizationUserReducers',
        payload: response,
      });
    },
  },

  reducers: {
    getList(state, action) {
      console.log(action.payload)
      return { ...state, getList: action.payload };
    },
    getUserListByOrganizationId(state, action) {
      return { ...state, getUserListByOrganizationId: action.payload.data };
    },
    saveResult(state, action) {
      return { ...state, saveCode: action };
    },
    initCompanyOrganizationsList(state, {payload}) {
      return {
        ...state,
        initCompanyOrganizationsList:payload,
      };
    },
    initCompanyListArray(state, {payload}) {
      return {
        ...state,
        companyListArray:payload,
      };
    },
    updateResult(state, action) {
      return { ...state, updateCode: action };
    },
    remove(state, { payload }) {
      return { ...state, removeResult: payload };
    },
   getOrganizationUserByIdReducers(state, { payload }) {
    return { ...state, OrganizationUserResult: payload };
    },
    BindOrganizationUser(state, { payload }) {
      return { ...state, setBindOrganizationUserResult: payload };
    },
    removeOrganizationUserReducers(state, { payload }) {
      return { ...state, removeOrganizationUserResult: payload };
    },

   },
};
export default depMange;
