import { queryRule,Remove} from '../../pages/DangerManage/reviewList/service';

const ReviewList = {
  namespace: 'reviewList',
  state: {
    Reviewlist: [],
    saveCode:'',
    removeResult:''
  },
  effects: {
    *getReviewList(_, { call, put }) {
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
      return { ...state, Reviewlist: action };
    },
    // saveResult(state, action) {
    //     return { ...state, saveCode: action };
    // },
    remove(state, { payload }) {
        return { ...state, removeResult: payload };
    },
   
  },
};
export default ReviewList;
