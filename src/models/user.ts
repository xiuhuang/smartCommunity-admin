import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  createBy?: string;
  createTime?: string;
  deptId?: string;
  deptList?: string;
  deptName?: string;
  email?: string;
  loginName?: string;
  phone?: string;
  remark?: string;
  roleList?: string;
  sex?: string;
  status?: string;
  updateBy?: string;
  updateTime?: string;
  userId?: string;
  userName?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<any>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      // action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          // notifyCount: action.payload.totalCount,
          // unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
