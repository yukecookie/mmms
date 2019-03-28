import modelExtend from 'dva-model-extend';
import { queryBirthScore } from '@/services/score';
import baseModal from './common';

export default modelExtend(baseModal, {
  namespace: 'givenByBirth',

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
      const httpData = yield call(queryBirthScore, { ...query, page, pageSize });
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
  },

  reducers: {},
});
