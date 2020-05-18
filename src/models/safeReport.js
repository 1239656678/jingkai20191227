import { fetchSecurityReportList } from '../pages/TargetResponsibility/service';

const safeReport = {
  namespace: 'safeReport',
  state: {
    saveCode: '',
    removeResult: '',
    updateCode: '',
    getData: [],
  },
  effects: {
    *safeReportList({ payload }, { call, put }) {
      // console.log ('111===',payload)
      // 请求数据接口
      const response = yield call(fetchSecurityReportList, payload);
      //存储数据的
      yield put({
        type: 'dataList',
        payload: response,
      });
    },
  },
  reducers: {
    dataList(state, action) {
      // console.log ('state11===',state)
      // console.log ('action11====',action)
      return {
        ...state,
        getData: action.payload,
      };
    },
  },
};
export default safeReport;
