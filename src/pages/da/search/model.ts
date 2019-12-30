import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, getFacilityDetail } from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  // historyList: [];
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
    getFacilityDetail: Effect;
    // fetchHistroy: Effect;
    // remove: Effect;
  };
  reducers: {
    save: Reducer<any>;
    // saveHistory: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'daSearch',

  state: {
    data: {
      data: [],
      total: 0,
    },
    // historyList: [],
  },

  effects: {
    *fetch({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      if (response.code === '200') {
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    *getFacilityDetail({ payload, callback }, { call }) {
      const response = yield call(getFacilityDetail, payload);
      if (callback) callback(response);
    },
    // *fetchHistroy({ payload, callback }, { put, call }) {
    //   const response = yield call(queryHistoryList, payload);
    //   yield put({
    //     type: 'saveHistory',
    //     payload: response,
    //   });
    //   if (callback) callback(response);
    // },
  },

  reducers: {
    save(state: StateType, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // saveHistory(state: StateType, action) {
    //   return {
    //     ...state,
    //     historyList: action.payload.data,
    //   };
    // },
  },
};

export default Model;
