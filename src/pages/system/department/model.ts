import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getTreeList, queryPageList, remove, add, deptDetail, edit } from './service';

export interface StateType {
  data?: [];
  serveList?: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getTreeData: Effect;
    getServeList: Effect;
    remove: Effect;
    add: Effect;
    deptDetail: Effect;
    edit: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveServe: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'department',
  state: {
    data: [],
    serveList: [],
  },
  effects: {
    *getTreeData({ payload, callback }, { put, call }) {
      const response = yield call(getTreeList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getServeList({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'saveServe',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      if (callback) callback(response);
    },
    *deptDetail({ payload, callback }, { call }) {
      const response = yield call(deptDetail, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    saveServe(state, action) {
      return {
        ...state,
        serveList: action.payload,
      };
    },
  },
};

export default Model;
