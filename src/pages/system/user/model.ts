import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, remove, getRoles, saveDetail, getUserInfo, changeStatus } from './service';

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
    fetch: Effect;
    remove: Effect;
    getRoles: Effect;
    saveDetail: Effect;
    getUserInfo: Effect;
    getUserList: Effect;
    changeStatus: Effect;
  };
  reducers: {
    save: Reducer<any>;
    changeStatusData: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'systemUser',

  state: {
    data: {
      data: [],
      total: 0,
    },
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
    *getRoles({ payload, callback }, { call }) {
      const response = yield call(getRoles, payload);
      if (callback) callback(response);
    },
    *saveDetail({ payload, callback }, { call }) {
      const response = yield call(saveDetail, payload);
      if (callback) callback(response);
    },
    *getUserInfo({ payload, callback }, { call }) {
      const response = yield call(getUserInfo, payload);
      if (callback) callback(response);
    },
    *getUserList({ payload, callback }, { call }) {
      const response = yield call(queryPageList, payload);
      if (callback) callback(response);
    },
    *changeStatus({ payload, callback }, { put, call }) {
      const response = yield call(changeStatus, payload);
      if (response.code === '200') {
        yield put({
          type: 'changeStatusData',
          payload,
        });
      }
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
    changeStatusData(state, action) {
      const newData = state.data.data.map((item: any) => {
        if (item.userId === action.payload.userId) {
          item.status = action.payload.status;
        }
        return item;
      });
      state.data.data = newData;
      return {
        ...state,
      };
    },
  },
};

export default Model;
