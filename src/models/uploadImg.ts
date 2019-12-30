import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { querySendRequest } from '@/services/api';

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
    getPolicyData: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'uploadImg',
  state: {
    data: {
      code: '',
      total: 0,
    },
  },
  effects: {
    *getPolicyData({ payload, callback }, { put, call }) {
      const response = yield call(querySendRequest, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
