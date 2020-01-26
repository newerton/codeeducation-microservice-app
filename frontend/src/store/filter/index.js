import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
  setReset: ['payload'],
  updateExtraFilter: ['payload'],
});

export const INITIAL_STATE = {
  search: null,
  pagination: {
    page: 1,
    per_page: 15,
  },
  order: {
    sort: null,
    dir: null,
  },
  extraFilter: null,
};

function setSearch(state = INITIAL_STATE, action) {
  return {
    ...state,
    search: action.payload.search,
    pagination: {
      ...state.pagination,
      page: 1,
    },
  };
}

function setPage(state = INITIAL_STATE, action) {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      page: action.payload.page,
    },
  };
}

function setPerPage(state = INITIAL_STATE, action) {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      per_page: action.payload.per_page,
    },
  };
}

function setOrder(state = INITIAL_STATE, action) {
  return {
    ...state,
    order: {
      sort: action.payload.sort,
      dir: action.payload.dir,
    },
  };
}

function setReset(state = INITIAL_STATE, action) {
  return action.payload.state;
}

function updateExtraFilter(state = INITIAL_STATE, action) {
  return {
    ...state,
    extraFilter: {
      ...state.extraFilter,
      ...action.payload,
    },
  };
}

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SEARCH]: setSearch,
  [Types.SET_PAGE]: setPage,
  [Types.SET_PER_PAGE]: setPerPage,
  [Types.SET_ORDER]: setOrder,
  [Types.SET_RESET]: setReset,
  [Types.UPDATE_EXTRA_FILTER]: updateExtraFilter,
});

export default reducer;
