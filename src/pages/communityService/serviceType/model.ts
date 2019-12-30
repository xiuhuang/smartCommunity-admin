import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryPageList, remove, addOrEidt, serviceTypeDetail } from './service';

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
    remove: Effect;
    addOrEidt: Effect;
    serviceTypeDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'serviceType',
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
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *addOrEidt({ payload, callback }, { call }) {
      const response = yield call(addOrEidt, payload);
      if (callback) callback(response);
    },
    *serviceTypeDetail({ payload, callback }, { call }) {
      const response = yield call(serviceTypeDetail, payload);
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
