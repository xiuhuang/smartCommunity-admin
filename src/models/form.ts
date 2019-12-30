import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fetchLevel, getDepartMent, getOssConfig } from '@/services/api';
// import { any } from 'prop-types';

export interface StateType {
  data: any;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchLevel: Effect;
    getDepartMent: Effect;
    getOssConfig: Effect;
  };
  reducers: {
    // save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'formModel',
  state: {
    data: {
      code: '',
      total: 0,
    },
  },
  effects: {
    *fetchLevel({ payload, callback }, { call }) {
      const response = yield call(fetchLevel, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *getDepartMent({ payload, callback }, { call }) {
      const response = yield call(getDepartMent, payload);
      if (callback) callback(response);
    },
    *getOssConfig({ payload, callback }, { call }) {
      const response = yield call(getOssConfig, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     data: action.payload,
    //   };
    // },
  },
};

export default Model;
