import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, remove, messageDetail, isRead } from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  rauseTagList: [];
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
    messageDetail: Effect;
    isRead: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveCauseTag: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'letter',

  state: {
    data: {
      data: [],
      total: 0,
    },
    rauseTagList: [],
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
    *messageDetail({ payload, callback }, { call }) {
      const response = yield call(messageDetail, payload);
      if (callback) callback(response);
    },
    *isRead({ payload, callback }, { call }) {
      const response = yield call(isRead, payload);
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
        rauseTagList: action.payload,
      };
    },
  },
};

export default Model;
