import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  queryPageList,
  remove,
  addInfo,
  serviceTypePageList,
  publishOrOffline,
  infoDetail,
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
    getDate: Effect;
    remove: Effect;
    addInfo: Effect;
    serviceTypePageList: Effect;
    publishOrOffline: Effect;
    infoDetail: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'service',
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
    *serviceTypePageList({ payload, callback }, { put, call }) {
      const response = yield call(serviceTypePageList, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *addInfo({ payload, callback }, { call }) {
      const response = yield call(addInfo, payload);
      if (callback) callback(response);
    },
    *publishOrOffline({ payload, callback }, { call }) {
      const response = yield call(publishOrOffline, payload);
      if (callback) callback(response);
    },
    *infoDetail({ payload, callback }, { call }) {
      const response = yield call(infoDetail, payload);
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
