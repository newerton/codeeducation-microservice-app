import { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';

import { isEqual } from 'lodash';
import { useDebounce } from 'use-debounce';
import * as Yup from 'yup';

import reducer, { Creators } from '~/store/filter';

export class FilterManager {
  constructor(options) {
    const {
      columns,
      rowsPerPage,
      rowsPerPageOptions,
      history,
      tableRef,
      extraFilter,
    } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    this.tableRef = tableRef;
    this.extraFilter = extraFilter;
    this.createValidationSchema();
  }

  resetTablePagination() {
    this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
    this.tableRef.current.changePage(0);
  }

  changeSearch(value) {
    this.dispatch(Creators.setSearch({ search: value }));
  }

  changePage(page) {
    this.dispatch(Creators.setPage({ page: page + 1 }));
  }

  changeRowsPerPage(perPage) {
    this.dispatch(Creators.setPerPage({ per_page: perPage }));
  }

  changeColumnSort(changedColumn, direction) {
    this.dispatch(
      Creators.setOrder({
        sort: changedColumn,
        dir: direction.includes('desc') ? 'desc' : 'asc',
      })
    );
    this.resetTablePagination();
  }

  changeExtraFilter(data) {
    this.dispatch(Creators.updateExtraFilter(data));
  }

  resetFilter() {
    const INITIAL_STATE = {
      ...this.schema.cast({}),
      search: { value: null, update: true },
    };
    this.dispatch(
      Creators.setReset({
        state: INITIAL_STATE,
      })
    );
    this.resetTablePagination();
  }

  applyOrderInColumns() {
    this.columns = this.columns.map(column => {
      return column.name === this.state.order.sort
        ? {
            ...column,
            options: {
              ...column.options,
              sortDirection: this.state.order.dir,
            },
          }
        : column;
    });
  }

  cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  replaceHistory() {
    this.history.replace({
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatSearchParams())}`,
      state: this.debouncedState,
    });
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatSearchParams())}`,
      state: {
        ...this.debouncedState,
        search: this.cleanSearchText(this.debouncedState.search),
      },
    };

    const prevState = this.history.location.state;
    const nextState = this.debouncedState;
    if (isEqual(prevState, nextState)) {
      return;
    }
    this.history.push(newLocation);
  }

  formatSearchParams() {
    const search = this.cleanSearchText(this.debouncedState.search);
    const { page } = this.debouncedState.pagination;
    const { per_page } = this.debouncedState.pagination;
    const { sort } = this.debouncedState.order;
    const { dir } = this.debouncedState.order;

    return {
      ...(search && search !== '' && { search }),
      ...(page > 1 && { page }),
      ...(per_page !== 5 && { per_page }),
      ...(sort && dir && { sort, dir }),
      ...(this.extraFilter &&
        this.extraFilter.formatSearchParams(this.debouncedState)),
    };
  }

  getStateFromURL() {
    const queryParams = new URLSearchParams(
      this.history.location.search.substr(1)
    );
    return this.schema.cast({
      search: queryParams.get('search'),
      pagination: {
        page: queryParams.get('page'),
        per_page: queryParams.get('per_page'),
      },
      order: {
        sort: queryParams.get('sort'),
        dir: queryParams.get('dir'),
      },
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.getStateFromURL(queryParams),
      }),
    });
  }

  createValidationSchema() {
    this.schema = Yup.object().shape({
      search: Yup.string()
        .transform(value => (!value ? undefined : value))
        .default(),
      pagination: Yup.object().shape({
        page: Yup.number()
          .transform(value =>
            isNaN(value) || parseInt(value, 10) < 1 ? undefined : value
          )
          .default(1),
        per_page: Yup.number()
          .transform(value =>
            isNaN(value) ||
            !this.rowsPerPageOptions.includes(parseInt(value, 10))
              ? undefined
              : value
          )
          .default(this.rowsPerPage),
      }),
      order: Yup.object().shape({
        sort: Yup.string()
          .nullable()
          .transform(value => {
            const columnsName = this.columns
              .filter(
                column => !column.options || column.options.sort !== false
              )
              .map(column => column.name);
            return columnsName.includes(value) ? value : undefined;
          })
          .default(null),
        dir: Yup.string()
          .nullable()
          .transform(value =>
            !value || !['asc', 'desc'].includes(value.toLowerCase())
              ? null
              : value
          )
          .default(15),
      }),
      ...(this.extraFilter && {
        extraFilter: this.extraFilter.createValidationSchema(),
      }),
    });
  }
}

export default function useFilter(options) {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const INITIAL_STATE = filterManager.getStateFromURL();
  const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
  const [totalRecords, setTotalRecords] = useState(0);

  filterManager.state = filterState;
  filterManager.debouncedState = debouncedFilterState;
  filterManager.dispatch = dispatch;

  filterManager.applyOrderInColumns();

  useEffect(() => {
    filterManager.replaceHistory();
  }, []); // eslint-disable-line

  return {
    columns: filterManager.columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  };
}
