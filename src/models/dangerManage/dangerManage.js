import { queryRule,RemovesmsDanger,getRepairInfo,assignRepair,assignReview,getRepairByDangerId,getReviewByDangerId} from '../../pages/DangerManage/service';

const dangerManage = {
  namespace: 'dangermanage',
  state: {
    Dangerlist: [],
    saveCode:'',
    removeResult:'',
    getDangerByIdResultcode:[],
    RepairByDangerIdResult:[],//隐患id获取整改信息结果
    ReviewByDangerIdResult:[],
    AssignReviewData:[]
  },
  effects: {
    *getDangerList(_, { call, put }) {
      const response = yield call(queryRule);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *getDangerListModel({ payload }, { call, put }) {
      const response = yield call(getRepairInfo, payload.id);
      yield put({
        type: 'getDangerByIdResult',
        payload: response,
      });
    },
    //整改
    *getRepairByDangerIdModel({ payload }, { call, put }) {
      const response = yield call(getRepairByDangerId, payload.id);
      yield put({
        type: 'getRepairByDangerIdReduces',
        payload: response,
      });
    },
    //复查
    *getReviewByDangerIdModel({ payload }, { call, put }) {
      const response = yield call(getReviewByDangerId, payload.id);
      yield put({
        type: 'getReviewByDangerIdReduces',
        payload: response,
      });
    },
    //指派整改
    *saveData({payload}, { call, put }) {
        const response = yield call(assignRepair,payload);
        yield put({
          type: 'saveResult',
          payload: response,
        });
    },
    //指派复查
     *saveAssignReview({payload}, { call, put }) {
      const response = yield call(assignReview,payload);
      yield put({
        type: 'saveAssignReviewResult',
        payload: response,
      });
  },
    *deleteData({ payload }, { call, put }) {
        const response = yield call(RemovesmsDanger, payload.id);
        yield put({
          type: 'remove',
          payload: response,
        });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, Dangerlist: action };
    },
    getDangerByIdResult(state, { payload }) {
      return { ...state, getDangerByIdResultcode: payload };
    },
    getRepairByDangerIdReduces(state, { payload }) {
      return { ...state, RepairByDangerIdResult: payload };
    },
    getReviewByDangerIdReduces(state, { payload }) {
      return { ...state, ReviewByDangerIdResult: payload };
    },
    saveAssignReviewResult(state, action) {
      return { ...state, AssignReviewData: action };
  },
    saveResult(state, action) {
        return { ...state, saveCode: action };
    },
    remove(state, { payload }) {
        return { ...state, removeResult: payload };
    },
   
  },
};
export default dangerManage;
