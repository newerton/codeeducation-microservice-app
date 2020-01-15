import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setSearch: ['payload'],
  setPage: ['payload'],
  setPerPage: ['payload'],
  setOrder: ['payload'],
  setReset: [],
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
  return {
    ...INITIAL_STATE,
    search: {
      value: null,
      update: true,
    },
  };
}

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SEARCH]: setSearch,
  [Types.SET_PAGE]: setPage,
  [Types.SET_PER_PAGE]: setPerPage,
  [Types.SET_ORDER]: setOrder,
  [Types.SET_RESET]: setReset,
});

export default reducer;
