import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import {
  queryPageList,
  remove,
  fetchCauseTag,
  submitCauseTag,
  removeCauseTag,
  addReservation,
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
    // removeCar: Effect;
    fetchCauseTag: Effect;
    submitCauseTag: Effect;
    removeCauseTag: Effect;
    addReservation: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveCauseTag: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'reservation',

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
      const response = yield call(submitCauseTag, payload);
      if (callback) callback(response);
    },
    *removeCauseTag({ payload, callback }, { call }) {
      const response = yield call(removeCauseTag, payload);
      if (callback) callback(response);
    },
    *addReservation({ payload, callback }, { call }) {
      const response = yield call(addReservation, payload);
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
