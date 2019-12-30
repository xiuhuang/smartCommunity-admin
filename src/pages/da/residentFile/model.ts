import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
// import { TableListItem } from './data.d';
import {
  queryPageList,
  removeCar,
  queryResidentList,
  queryResidentTag,
  removeResident,
  queryCarList,
  saveTag,
  queryDetail,
  addResident,
  getCarInfoById,
  getResidentInfoById,
  getResidentInfo,
  getCarInfoByResidentId,
  saveCarInfo,
  getCommunityTree,
  exportResidentData,
  exportCarData,
} from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  residentList: {
    data: [];
    total: 0;
  };
  carList: {
    data: [];
    total: 0;
  };
  residentTagList: [];
  carTagList: [];
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
    fetchResidentList: Effect;
    fetchCarList: Effect;
    removeResident: Effect;
    addResident: Effect;
    getResidentInfo: Effect;
    removeCar: Effect;
    fetchResidentTag: Effect;
    submitResidentTag: Effect;
    fetchCarTag: Effect;
    submitCarTag: Effect;
    fetchDetail: Effect;
    getCarInfoById: Effect;
    getResidentInfoById: Effect;
    getCarInfoByResidentId: Effect;
    saveCarInfo: Effect;
    getCommunityTree: Effect;
    exportResidentData: Effect;
    exportCarData: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveResidentList: Reducer<any>;
    saveCarList: Reducer<any>;
    saveResidentTag: Reducer<any>;
    saveCarTag: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'residentFile',

  state: {
    data: {
      data: [],
      total: 0,
    },
    residentTagList: [],
    carTagList: [],
    residentList: {
      data: [],
      total: 0,
    },
    carList: {
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
    *fetchResidentList({ payload, callback }, { put, call }) {
      const response = yield call(queryResidentList, payload);
      yield put({
        type: 'saveResidentList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addResident({ payload, callback }, { call }) {
      const response = yield call(addResident, payload);
      if (callback) callback(response);
    },
    *fetchCarList({ payload, callback }, { put, call }) {
      const response = yield call(queryCarList, payload);
      yield put({
        type: 'saveCarList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *removeResident({ payload, callback }, { call }) {
      const response = yield call(removeResident, payload);
      if (callback) callback(response);
    },
    *getResidentInfo({ payload, callback }, { call }) {
      const response = yield call(getResidentInfo, payload);
      if (callback) callback(response);
    },
    *fetchResidentTag({ payload, callback }, { put, call }) {
      const response = yield call(queryResidentTag, payload);
      yield put({
        type: 'saveResidentTag',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *submitResidentTag({ payload, callback }, { call }) {
      const response = yield call(saveTag, payload);
      if (callback) callback(response);
    },
    *removeCar({ payload, callback }, { call }) {
      const response = yield call(removeCar, payload);
      if (callback) callback(response);
    },
    *fetchCarTag({ payload, callback }, { put, call }) {
      const response = yield call(queryResidentTag, payload);
      yield put({
        type: 'saveCarTag',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *submitCarTag({ payload, callback }, { call }) {
      const response = yield call(saveTag, payload);
      if (callback) callback(response);
    },
    *fetchDetail({ payload, callback }, { call }) {
      const response = yield call(queryDetail, payload);
      if (callback) callback(response);
    },
    *getCarInfoById({ payload, callback }, { call }) {
      const response = yield call(getCarInfoById, payload);
      if (callback) callback(response);
    },
    *getResidentInfoById({ payload, callback }, { call }) {
      const response = yield call(getResidentInfoById, payload);
      if (callback) callback(response);
    },
    *getCarInfoByResidentId({ payload, callback }, { call }) {
      const response = yield call(getCarInfoByResidentId, payload);
      if (callback) callback(response);
    },
    *saveCarInfo({ payload, callback }, { call }) {
      const response = yield call(saveCarInfo, payload);
      if (callback) callback(response);
    },
    *getCommunityTree({ payload, callback }, { call }) {
      const response = yield call(getCommunityTree, payload);
      if (callback) callback(response);
    },
    *exportResidentData({ payload, callback }, { call }) {
      const response = yield call(exportResidentData, payload);
      if (callback) callback(response);
    },
    *exportCarData({ payload, callback }, { call }) {
      const response = yield call(exportCarData, payload);
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
    saveResidentList(state, action) {
      return {
        ...state,
        residentList: action.payload,
      };
    },
    saveCarList(state, action) {
      return {
        ...state,
        carList: action.payload,
      };
    },
    saveResidentTag(state, action) {
      return {
        ...state,
        residentTagList: action.payload,
      };
    },
    saveCarTag(state, action) {
      return {
        ...state,
        carTagList: action.payload,
      };
    },
  },
};

export default Model;
