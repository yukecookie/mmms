export default {
  namespace: 'common',
  state: {},

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    replaceState(state, { payload }) {
      if (payload) {
        return payload;
      }
      return state;
    },
  },
};
