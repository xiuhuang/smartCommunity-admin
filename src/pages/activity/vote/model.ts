import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  queryPageList,
  remove,
  getTableDetail,
  publish,
  addActivity,
  auditPageList,
  canEdit,
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
    getTableDetail: Effect;
    publish: Effect;
    addActivity: Effect;
    auditPageList: Effect;
    canEdit: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'activity',
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
    *getTableDetail({ payload, callback }, { call }) {
      const response = yield call(getTableDetail, payload);
      if (callback) callback(response);
    },
    *publish({ payload, callback }, { call }) {
      const response = yield call(publish, payload);
      if (callback) callback(response);
    },
    *addActivity({ payload, callback }, { call }) {
      const response = yield call(addActivity, payload);
      if (callback) callback(response);
    },
    *auditPageList({ payload, callback }, { call }) {
      const response = yield call(auditPageList, payload);
      if (callback) callback(response);
    },
    *canEdit({ payload, callback }, { call }) {
      const response = yield call(canEdit, payload);
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
