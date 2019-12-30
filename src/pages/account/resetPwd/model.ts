import { AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';
import { resetPwd } from './service';

export interface StateType {
  data: {};
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    resetPwd: Effect;
  };
  reducers: {};
}

const Model: ModelType = {
  namespace: 'resetPwd',
  state: {
    data: {},
  },
  effects: {
    *resetPwd({ payload, callback }, { call }) {
      const response = yield call(resetPwd, payload);
      if (callback) callback(response);
    },
  },

  reducers: {},
};

export default Model;
