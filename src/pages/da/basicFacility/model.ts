import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import {
  fetchFacilityList,
  fetchTypeBrandTagList,
  fetchFacilityTagList,
  saveGroupTag,
  fetchTypeBrandList,
  removeFacilityTag,
  removeTypeBrandTag,
  submitTypeBrandTag,
  saveFacility,
  removeFacility,
  saveTypeBrandForm,
  removeTypeBrand,
  fetchMoitoring,
  saveMoitoringForm,
  removeMoitoring,
  getFacilityDetail,
  getMoitoringDetail,
  getTypeBrandDetail,
  exportData,
} from './service';

export interface StateType {
  data: {
    data: [];
    total: 0;
  };
  facilityData: {
    data: [];
    total: 0;
  };
  typeBrandData: {
    data: [];
    total: 0;
  };
  moitoringData: {
    data: [];
    total: 0;
  };
  residentTagList: [];
  facilityTagList: [];
  typeBrandTagList: [];
  brandAll: [];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchFacility: Effect;
    fetchTypeBrand: Effect;
    removeFacility: Effect;
    fetchFacilityTag: Effect;
    fetchTypeBrandTag: Effect;
    removeFacilityTag: Effect;
    removeTypeBrandTag: Effect;
    submitFacilityTag: Effect;
    submitTypeBrandTag: Effect;
    saveFacilityForm: Effect;
    fetchBrandAll: Effect;
    saveTypeBrandForm: Effect;
    removeTypeBrand: Effect;
    fetchMoitoring: Effect;
    saveMoitoringForm: Effect;
    fetchFacilityAll: Effect;
    removeMoitoring: Effect;
    getFacilityDetail: Effect;
    getMoitoringDetail: Effect;
    getTypeBrandDetail: Effect;
    exportFile: Effect;
  };
  reducers: {
    save: Reducer<any>;
    saveFacility: Reducer<any>;
    saveTypeBrand: Reducer<any>;
    saveMoitoring: Reducer<any>;
    saveTypeBrandTag: Reducer<any>;
    saveFacilityTag: Reducer<any>;
    saveTypeBrandAll: Reducer<any>;
  };
}

const Model: ModelType = {
  namespace: 'basicFacility',

  state: {
    data: {
      data: [],
      total: 0,
    },
    facilityData: {
      data: [],
      total: 0,
    },
    typeBrandData: {
      data: [],
      total: 0,
    },
    moitoringData: {
      data: [],
      total: 0,
    },
    residentTagList: [],
    facilityTagList: [],
    typeBrandTagList: [],
    brandAll: [],
  },

  effects: {
    *fetchFacility({ payload, callback }, { put, call }) {
      const response = yield call(fetchFacilityList, payload);
      yield put({
        type: 'saveFacility',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchFacilityAll({ payload, callback }, { call }) {
      const response = yield call(fetchFacilityList, payload);
      if (callback) callback(response);
    },
    *fetchTypeBrand({ payload, callback }, { put, call }) {
      const response = yield call(fetchTypeBrandList, payload);
      yield put({
        type: 'saveTypeBrand',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchBrandAll({ payload, callback }, { put, call }) {
      const response = yield call(fetchTypeBrandList, payload);
      yield put({
        type: 'saveTypeBrandAll',
        payload: response,
      });
      if (callback) callback(response);
    },
    *removeFacility({ payload, callback }, { call }) {
      const response = yield call(removeFacility, payload);
      if (callback) callback(response);
    },
    *fetchFacilityTag({ payload, callback }, { put, call }) {
      const response = yield call(fetchFacilityTagList, payload);
      yield put({
        type: 'saveFacilityTag',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *removeTypeBrandTag({ payload, callback }, { call }) {
      const response = yield call(removeTypeBrandTag, payload);
      if (callback) callback(response);
    },
    *fetchTypeBrandTag({ payload, callback }, { put, call }) {
      const response = yield call(fetchTypeBrandTagList, payload);
      yield put({
        type: 'saveTypeBrandTag',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *submitFacilityTag({ payload, callback }, { call }) {
      const response = yield call(saveGroupTag, payload);
      if (callback) callback(response);
    },
    *submitTypeBrandTag({ payload, callback }, { call }) {
      const response = yield call(submitTypeBrandTag, payload);
      if (callback) callback(response);
    },
    *removeFacilityTag({ payload, callback }, { call }) {
      const response = yield call(removeFacilityTag, payload);
      if (callback) callback(response);
    },
    *saveFacilityForm({ payload, callback }, { call }) {
      const response = yield call(saveFacility, payload);
      if (callback) callback(response);
    },
    *saveTypeBrandForm({ payload, callback }, { call }) {
      const response = yield call(saveTypeBrandForm, payload);
      if (callback) callback(response);
    },
    *removeTypeBrand({ payload, callback }, { call }) {
      const response = yield call(removeTypeBrand, payload);
      if (callback) callback(response);
    },
    *fetchMoitoring({ payload, callback }, { put, call }) {
      const response = yield call(fetchMoitoring, payload);
      yield put({
        type: 'saveMoitoring',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveMoitoringForm({ payload, callback }, { call }) {
      const response = yield call(saveMoitoringForm, payload);
      if (callback) callback(response);
    },
    *removeMoitoring({ payload, callback }, { call }) {
      const response = yield call(removeMoitoring, payload);
      if (callback) callback(response);
    },
    *getFacilityDetail({ payload, callback }, { call }) {
      const response = yield call(getFacilityDetail, payload);
      if (callback) callback(response);
    },
    *getMoitoringDetail({ payload, callback }, { call }) {
      const response = yield call(getMoitoringDetail, payload);
      if (callback) callback(response);
    },
    *getTypeBrandDetail({ payload, callback }, { call }) {
      const response = yield call(getTypeBrandDetail, payload);
      if (callback) callback(response);
    },
    *exportFile({ payload, callback }, { call }) {
      const response = yield call(exportData, payload);
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
    saveFacility(state, action) {
      return {
        ...state,
        facilityData: action.payload,
      };
    },
    saveTypeBrand(state, action) {
      return {
        ...state,
        typeBrandData: action.payload,
      };
    },
    saveMoitoring(state, action) {
      return {
        ...state,
        moitoringData: action.payload,
      };
    },
    saveTypeBrandAll(state, action) {
      return {
        ...state,
        brandAll: action.payload.data,
      };
    },
    saveTypeBrandTag(state, action) {
      return {
        ...state,
        typeBrandTagList: action.payload,
      };
    },
    saveFacilityTag(state, action) {
      return {
        ...state,
        facilityTagList: action.payload,
      };
    },
  },
};

export default Model;
