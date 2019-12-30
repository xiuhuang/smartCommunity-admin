import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import {
  queryPageList,
  remove,
  saveOrEdit,
  backPay,
  depositDetail,
  refund,
  exportData,
} from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getData: Effect;
    remove: Effect;
    saveOrEdit: Effect;
    backPay: Effect;
    depositDetail: Effect;
    refund: Effect;
    exportData: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'deposit',

  state: {
    data: {
      data: [],
      total: 0,
    },
  },

  effects: {
    *getData({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *saveOrEdit({ payload, callback }, { call }) {
      const response = yield call(saveOrEdit, payload);
      if (callback) callback(response);
    },
    *backPay({ payload, callback }, { call }) {
      const response = yield call(backPay, payload);
      if (callback) callback(response);
    },
    *depositDetail({ payload, callback }, { call }) {
      const response = yield call(depositDetail, payload);
      if (callback) callback(response);
    },
    *refund({ payload, callback }, { call }) {
      const response = yield call(refund, payload);
      if (callback) callback(response);
    },
    *exportData({ payload, callback }, { call }) {
      const response = yield call(exportData, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
