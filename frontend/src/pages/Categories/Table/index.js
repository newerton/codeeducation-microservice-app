import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Chip } from '@material-ui/core';
import { format, parseISO } from 'date-fns';

import GridView from '~/components/GridView/';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import useFilter from '~/hooks/useFilter';
import { Creators } from '~/store/filter';
import categoryHttp from '~/util/http/category-http';

const columnsDefinitions = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
    options: {
      sort: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
    width: '43%',
  },
  {
    name: 'is_active',
    label: 'Ativo?',
    width: '4%',
    options: {
      customBodyRender(value) {
        return value ? (
          <Chip label="Sim" color="primary" />
        ) : (
          <Chip label="Não" color="secondary" />
        );
      },
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    width: '10%',
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
  {
    name: 'actions',
    label: 'Ações',
    width: '13%',
    options: {
      sort: false,
    },
  },
];

const btnAdd = (
  <Button
    variant="outlined"
    color="primary"
    component={Link}
    to="/categories/create"
  >
    Adicionar
  </Button>
);

const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 30, 60, 120];

export default function Table() {
  const subscribed = useRef(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinitions,
    debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
  });

  async function loadData() {
    const { data } = await categoryHttp.list({
      queryParams: {
        search: filterManager.cleanSearchText(filterState.search),
        page: filterState.pagination.page,
        per_page: filterState.pagination.per_page,
        sort: filterState.order.sort,
        dir: filterState.order.dir,
      },
    });

    if (subscribed.current) {
      setData(data.data);
      setTotalRecords(data.meta.total);
      setLoading(false);
    }
  }

  useEffect(() => {
    subscribed.current = true;
    setLoading(true);
    filterManager.pushHistory();
    loadData();
    return () => {
      subscribed.current = false;
    };
  }, [filterManager.cleanSearchText(debouncedFilterState.search), debouncedFilterState.pagination.page, debouncedFilterState.pagination.per_page, debouncedFilterState.order]); // eslint-disable-line

  return (
    <GridView
      title={btnAdd}
      columns={columns}
      data={data}
      loading={loading}
      debouncedSearchTime={debounceSearchTime}
      options={{
        serverSide: true,
        responsive: 'scrollMaxHeight',
        searchText: filterState.search,
        page: filterState.pagination.page - 1,
        rowsPerPage: filterState.pagination.per_page,
        count: totalRecords,
        customToolbar: () => (
          <FilterResetButton
            handleClick={() => dispatch(Creators.setReset())}
          />
        ),
        onSearchChange: value => filterManager.changeSearch(value),
        onChangePage: page => filterManager.changePage(page),
        onChangeRowsPerPage: perPage =>
          filterManager.changeRowsPerPage(perPage),
        onColumnSortChange: (changedColumn, direction) =>
          filterManager.changeColumnSort(changedColumn, direction),
      }}
    />
  );
}
