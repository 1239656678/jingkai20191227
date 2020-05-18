import { querySmsEquipmentBaseInfoList ,AddSmsEquipmentBaseInfo,RemoveSmsEquipmentBaseInfo,update} from '../pages/equipmentLedger/service';


const equipmentLedger = {
  namespace: 'equipmentLedger',
  state: {
    dataList:[],
    save :'',
    list:[],
    count:'',
    remove:'',
    updateCode:''
  },
  effects: {
    *querySmsEquipmentBaseInfoList({payload}, { call, put }) {
      const response = yield call(querySmsEquipmentBaseInfoList,payload);
      yield put({
        type: 'getList',
        payload: response,
      });
    },

    *AddSmsEquipmentBaseInfo({payload}, { call, put }) {
      const response = yield call(AddSmsEquipmentBaseInfo,payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *updateData({payload}, { call, put }) {
      const response = yield call(update,payload);
      yield put({
        type: 'updateResult',
        payload: response,
      });
    },
    *RemoveSmsEquipmentBaseInfo({payload}, { call, put }) {
      const response = yield call(RemoveSmsEquipmentBaseInfo,payload.id);
      yield put({
        type: 'removeResult',
        payload: response,
      });
    },
  },
  reducers: {
    getList(state, action) {
      return { ...state, dataList: action.payload.data.content };
    },
    list(state, action) {

      return { ...state, list: action.payload.data ,count : action.payload.data.length };
    },
    save(state, {payload}) {
      return {
        ...state,
        save:payload,
      };
    },
    updateResult(state, action) {
      return { ...state, updateCode: action.payload.code };
    },
    removeResult(state, {payload}) {
      return {
        ...state,
        remove:payload,
      };
    },
  },
};
export default equipmentLedger;
