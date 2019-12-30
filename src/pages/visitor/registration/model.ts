import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import {
  queryPageList,
  remove,
  fetchCauseTag,
  add,
  getDetail,
  validCode,
  addRecordByCode,
  exportVisitor,
} from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  causeTagList: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    remove: Effect;
    removeCar: Effect;
    fetchCauseTag: Effect;
    submitCauseTag: Effect;
    add: Effect;
    getDetail: Effect;
    validCode: Effect;
    addRecordByCode: Effect;
    exportVisitor: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveCauseTag: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'visitorRegistration',

  state: {
    data: {
      data: [],
      total: 0,
    },
    causeTagList: [],
  },

  effects: {
    *fetch({ payload, callback }, { put, call }) {
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
    *fetchCauseTag({ payload, callback }, { put, call }) {
      const response = yield call(fetchCauseTag, payload);
      yield put({
        type: 'saveCauseTag',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *submitCauseTag({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *removeCar({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *getDetail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      if (callback) callback(response);
    },
    *validCode({ payload, callback }, { call }) {
      const response = yield call(validCode, payload);
      if (callback) callback(response);
    },
    *addRecordByCode({ payload, callback }, { call }) {
      const response = yield call(addRecordByCode, payload);
      if (callback) callback(response);
    },
    *exportVisitor({ payload, callback }, { call }) {
      const response = yield call(exportVisitor, payload);
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
    saveCauseTag(state, action) {
      return {
        ...state,
        causeTagList: action.payload,
      };
    },
  },
};

export default Model;
