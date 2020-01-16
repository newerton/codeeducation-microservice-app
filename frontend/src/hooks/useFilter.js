import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';

import { isEqual } from 'lodash';
import { useDebounce } from 'use-debounce';
import * as Yup from 'yup';

import reducer, { Creators } from '~/store/filter';

export default function useFilter(options) {
  const history = useHistory();
  const filterManager = new FilterManager({ ...options, history });
  const INITIAL_STATE = filterManager.getStateFromUrl();
  const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
  const [totalRecords, setTotalRecords] = useState(0);

  filterManager.state = filterState;
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

export class FilterManager {
  constructor(options) {
    const { columns, rowsPerPage, rowsPerPageOptions, history } = options;
    this.columns = columns;
    this.rowsPerPage = rowsPerPage;
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.history = history;
    this.createValidationSchema();
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
      state: this.state,
    });
  }

  pushHistory() {
    const newLocation = {
      pathname: this.history.location.pathname,
      search: `?${new URLSearchParams(this.formatSearchParams())}`,
      state: {
        ...this.state,
        search: this.cleanSearchText(this.state.search),
      },
    };

    const prevState = this.history.location.state;
    const nextState = this.state;
    if (isEqual(prevState, nextState)) {
      return;
    }
    this.history.push(newLocation);
  }

  formatSearchParams() {
    const search = this.cleanSearchText(this.state.search);
    const { page } = this.state.pagination;
    const { per_page } = this.state.pagination;
    const { sort } = this.state.order;
    const { dir } = this.state.order;

    return {
      ...(search && search !== '' && { search }),
      ...(page > 1 && { page }),
      ...(per_page !== 5 && { per_page }),
      ...(sort && dir && { sort, dir }),
    };
  }

  getStateFromUrl() {
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
          .oneOf(this.rowsPerPageOptions)
          .transform(value => (isNaN(value) ? undefined : value))
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
    });
  }
}
