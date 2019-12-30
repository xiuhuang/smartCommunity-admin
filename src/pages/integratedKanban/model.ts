import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getOwnership, getElementData } from './service';

export interface StateType {
  ownershipData?: [];
  elementData?: [];
  isLoading?: boolean;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getOwnershipData: Effect;
    getElementData: Effect;
  };
  reducers: {
    saveOwnership: Reducer<StateType>;
    saveElement: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'bulletinBoard',
  state: {
    ownershipData: [],
    elementData: [],
  },
  effects: {
    *getOwnershipData({ payload, callback }, { put, call }) {
      const response = yield call(getOwnership, payload);
      yield put({
        type: 'saveOwnership',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getElementData({ payload, callback }, { put, call }) {
      const response = yield call(getElementData, payload);
      yield put({
        type: 'saveElement',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveOwnership(state, action) {
      return {
        ...state,
        ownershipData: action.payload.data,
      };
    },
    saveElement(state, action) {
      return {
        ...state,
        elementData: action.payload.data,
      };
    },
  },
};

export default Model;
