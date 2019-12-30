import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  getTreeList,
  queryPageList,
  remove,
  addcommunity,
  getTableDetail,
  editTableDetail,
  addServeData,
  removePageItem,
  exportData,
} from './service';

export interface StateType {
  data?: [];
  serveDetail?: any;
  serveList?: any;
  editDetail?: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    remove: Effect;
    getTreeData: Effect;
    Addcommunity: Effect;
    getServeList: Effect;
    getTableDetail: Effect;
    editTableDetail: Effect;
    addServeData: Effect;
    removeServeItem: Effect;
    exportData: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveAddcommunity: Reducer<StateType>;
    saveServe: Reducer<StateType>;
    saveDetail: Reducer<StateType>;
    editDetail: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'basicInfo',
  state: {
    data: [],
    serveList: [],
  },
  effects: {
    *remove({ payload, callback }, { put, call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *getTreeData({ payload, callback }, { put, call }) {
      const response = yield call(getTreeList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *Addcommunity({ payload, callback }, { put, call }) {
      const response = yield call(addcommunity, payload);
      yield put({
        type: 'saveAddcommunity',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getServeList({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'saveServe',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getTableDetail({ payload, callback }, { put, call }) {
      const response = yield call(getTableDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *editTableDetail({ payload, callback }, { put, call }) {
      const response = yield call(editTableDetail, payload);
      yield put({
        type: 'editDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addServeData({ payload, callback }, { put, call }) {
      const response = yield call(addServeData, payload);
      if (callback) callback(response);
    },
    *removeServeItem({ payload, callback }, { put, call }) {
      const response = yield call(removePageItem, payload);
      if (callback) callback(response);
    },
    *exportData({ payload, callback }, { put, call }) {
      const response = yield call(exportData, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    saveAddcommunity(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveServe(state, action) {
      return {
        ...state,
        serveList: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        serveDetail: action.payload,
      };
    },
    editDetail(state, action) {
      return {
        ...state,
        editDetail: action.payload,
      };
    },
  },
};

export default Model;
