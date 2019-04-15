import modelExtend from 'dva-model-extend';
import {
  queryUserInfo,
  queryAddUserInfo,
  queryId,
  queryMobileVerify,
  queryUserNameVerify,
} from '@/services/userInfo';
import baseModal from './common';

export default modelExtend(baseModal, {
  namespace: 'userInfoAdd',

  state: {
    query: {},
    pagination: {}, // 分页设置参数,
    selectedRowKeys: [],
    dataSourceMap: {},
    dataSource: [],
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const { page = 1, pageSize = 10, ...query } = payload;
      const httpData = yield call(queryUserInfo, { ...query, page, pageSize });
      if (httpData && httpData.success) {
        yield put({
          type: 'updateState',
          payload: {
            query,
            dataSource: httpData.data,
            selectedRowKeys: [],
            pagination: {
              current: page,
              pageSize,
              total: httpData.total,
            },
          },
        });
      } else {
        throw httpData;
      }
    },

    *fetchId({ payload }, { call }) {
      return yield call(queryId, payload);
    },

    *fetchAddUserInfo({ payload }, { call }) {
      const { ...query } = payload;
      return yield call(queryAddUserInfo, { ...query });
    },

    *fetchMobileVerify({ payload }, { call }) {
      const { ...query } = payload;
      return yield call(queryMobileVerify, { ...query });
    },

    *fetchUserNameVerify({ payload }, { call }) {
      const { ...query } = payload;
      return yield call(queryUserNameVerify, { ...query });
    },
  },

  reducers: {},
});
