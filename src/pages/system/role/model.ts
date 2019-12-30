import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, remove, addRole, editRole, getAllMenu, savePremission } from './service';

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
    addRole: Effect;
    editRole: Effect;
    submitCauseTag: Effect;
    getAllMenu: Effect;
    savePremission: Effect;
  };
  reducers: {
    save: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'role',

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
    *addRole({ payload, callback }, { put, call }) {
      const response = yield call(addRole, payload);
      if (callback) callback(response);
    },
    *editRole({ payload, callback }, { put, call }) {
      const response = yield call(editRole, payload);
      if (callback) callback(response);
    },
    *submitCauseTag({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
    *getAllMenu({ payload, callback }, { call }) {
      const response = yield call(getAllMenu, payload);
      if (callback) callback(response);
    },
    *savePremission({ payload, callback }, { call }) {
      const response = yield call(savePremission, payload);
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
