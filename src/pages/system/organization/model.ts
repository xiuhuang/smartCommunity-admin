import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, remove, getUserInfo, saveDetail, exportData } from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  // rauseTagList: [];
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
    getUserInfo: Effect;
    saveDetail: Effect;
    exportData: Effect;
    // removeCar: Effect;
    // fetchCauseTag: Effect;
    // submitCauseTag: Effect;
  };
  reducers: {
    save: Reducer<any>;
    // saveCauseTag: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'organization',

  state: {
    data: {
      data: [],
      total: 0,
    },
    // rauseTagList: [],
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
    *getUserInfo({ payload, callback }, { call }) {
      const response = yield call(getUserInfo, payload);
      if (callback) callback(response);
    },
    *saveDetail({ payload, callback }, { call }) {
      const response = yield call(saveDetail, payload);
      if (callback) callback(response);
    },
    *exportData({ payload, callback }, { call }) {
      const response = yield call(exportData, payload);
      if (callback) callback(response);
    },
    // *fetchCauseTag({ payload, callback }, { put, call }) {
    //   const response = yield call(queryPageList, payload);
    //   yield put({
    //     type: 'saveCauseTag',
    //     payload: response.data,
    //   });
    //   if (callback) callback(response);
    // },
    // *submitCauseTag({ payload, callback }, { call }) {
    //   const response = yield call(remove, payload);
    //   if (callback) callback(response);
    // },
    // *removeCar({ payload, callback }, { call }) {
    //   const response = yield call(remove, payload);
    //   if (callback) callback(response);
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // saveCauseTag(state, action) {
    //   return {
    //     ...state,
    //     rauseTagList: action.payload,
    //   };
    // },
  },
};

export default Model;
