import modelExtend from 'dva-model-extend';
import { queryConsumptionInfo, queryTag } from '@/services/consumption';
import baseModal from './common';

export default modelExtend(baseModal, {
  namespace: 'consumptionInfo',

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
      const httpData = yield call(queryConsumptionInfo, { ...query, page, pageSize });
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
    *fetchTag({ payload }, { call }) {
      const httpData = yield call(queryTag, payload);
      return httpData;
    },
  },

  reducers: {
    changeActiveData(state, { payload }) {
      const { pageFlag, data } = payload;
      return {
        ...state,
        ...data,
        selectedRowKeys: pageFlag ? state.selectedRowKeys : [],
        dataSourceMap: pageFlag ? state.dataSourceMap : {},
      };
    },
  },
});
