import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  queryPageList,
  remove,
  removeMember,
  addOrEdit,
  getEditDetail,
  baseComMemberList,
  addOrEditMember,
  queryCarList,
  addOrEditCar,
  getCarInfo,
  getResidentInfo,
  removeCar,
  getCarTags,
  exportFile,
} from './service';

export interface StateType {
  detailData: {
    detailData: '';
  };
  data: {
    data: [];
    total: 0;
  };
  memberData: {
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
    fetch: Effect;
    fetchCarList: Effect;
    remove: Effect;
    removeMember: Effect;
    editReport: Effect;
    saveOrEdit: Effect;
    getDetailData: Effect;
    fetchMemberList: Effect;
    saveOrEditCar: Effect;
    getCarInfoDetail: Effect;
    getResidentInfo: Effect;
    removeCar: Effect;
    getCarTags: Effect;
    exportFile: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveMember: Reducer<any>;
    saveCar: Reducer<any>;
    saveDetail: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'institution',
  state: {
    detailData: {
      detailData: '',
    },
    data: {
      data: [],
      total: 0,
    },
    memberData: {
      data: [],
      total: 0,
    },
    carData: {
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
    *fetchCarList({ payload, callback }, { put, call }) {
      const response = yield call(queryCarList, payload);
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
    *removeMember({ payload, callback }, { call }) {
      const response = yield call(removeMember, payload);
      if (callback) callback(response);
    },
    *editReport({ payload, callback }, { call }) {
      const response = yield call(addOrEditMember, payload);
      if (callback) callback(response);
    },
    *saveOrEdit({ payload, callback }, { call }) {
      const response = yield call(addOrEdit, payload);
      if (callback) callback(response);
    },
    *saveOrEditCar({ payload, callback }, { call }) {
      const response = yield call(addOrEditCar, payload);
      if (callback) callback(response);
    },
    *getCarInfoDetail({ payload, callback }, { call }) {
      const response = yield call(getCarInfo, payload);
      if (callback) callback(response);
    },
    *getResidentInfo({ payload, callback }, { call }) {
      const response = yield call(getResidentInfo, payload);
      if (callback) callback(response);
    },
    *getDetailData({ payload, callback }, { put, call }) {
      const response = yield call(getEditDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchMemberList({ payload, callback }, { put, call }) {
      const response = yield call(baseComMemberList, payload);
      yield put({
        type: 'saveMember',
        payload: response,
      });
      if (callback) callback(response);
    },
    *removeCar({ payload, callback }, { call }) {
      const response = yield call(removeCar, payload);
      if (callback) callback(response);
    },
    *getCarTags({ payload, callback }, { call }) {
      const response = yield call(getCarTags, payload);
      if (callback) callback(response);
    },
    *exportFile({ payload, callback }, { call }) {
      const response = yield call(exportFile, payload);
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
    saveCar(state, action) {
      return {
        ...state,
        carData: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detailData: action.payload.data,
      };
    },
    saveMember(state, action) {
      return {
        ...state,
        memberData: action.payload,
      };
    },
  },
};

export default Model;
