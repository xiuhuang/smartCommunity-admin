import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryPageList, audit, getDetail } from './service';

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
    getDate: Effect;
    audit: Effect;
    getDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'activityAudit',
  state: {
    data: {
      data: [],
      total: 0,
    },
  },
  effects: {
    *getDate({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *audit({ payload, callback }, { call }) {
      const response = yield call(audit, payload);
      if (callback) callback(response);
    },
    *getDetail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
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
