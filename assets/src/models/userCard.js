import modelExtend from 'dva-model-extend';
import { queryCardLost, queryCardCharge } from '@/services/card';
import baseModal from './common';

export default modelExtend(baseModal, {
  namespace: 'userCard',

  state: {
    // query: {},
    // pagination: {}, // 分页设置参数,
    // selectedRowKeys: [],
    // dataSourceMap: {},
    // dataSource: [],
  },

  effects: {
    *fetchCardLost({ payload }, { call }) {
      const { ...query } = payload;
      return yield call(queryCardLost, { ...query });
    },

    *fetchCardCharge({ payload }, { call }) {
      const { ...query } = payload;
      return yield call(queryCardCharge, { ...query });
    },
  },

  reducers: {},
});
