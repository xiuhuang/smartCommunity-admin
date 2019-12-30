import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import { queryPageList, remove } from './service';

export interface StateType {
  personData: {
    data: [];
    total: 0;
  };
  carData: {
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
    fetchPerson: Effect;
    fetchCar: Effect;
    remove: Effect;
  };
  reducers: {
    savePerson: Reducer<any>;
    saveCar: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'focus',

  state: {
    personData: {
      data: [],
      total: 0,
    },
    carData: {
      data: [],
      total: 0,
    },
  },

  effects: {
    *fetchPerson({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'savePerson',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchCar({ payload, callback }, { put, call }) {
      const response = yield call(queryPageList, payload);
      yield put({
        type: 'saveCar',
        payload: response,
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    savePerson(state, action) {
      return {
        ...state,
        personData: action.payload,
      };
    },
    saveCar(state, action) {
      return {
        ...state,
        carData: action.payload,
      };
    },
  },
};

export default Model;
