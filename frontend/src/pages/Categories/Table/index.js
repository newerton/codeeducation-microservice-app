import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Chip } from '@material-ui/core';
import { format, parseISO } from 'date-fns';

import GridView from '~/components/GridView/';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import reducer, { Creators, INITIAL_STATE } from '~/store/filter';
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

export default function Table() {
  const subscribed = useRef(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [totalRecords, setTotalRecords] = useState(0);

  const columns = columnsDefinitions.map(column => {
    return column.name === filterState.order.sort
      ? {
          ...column,
          options: {
            ...column.options,
            sortDirection: filterState.order.dir,
          },
        }
      : column;
  });

  function cleanSearchText(text) {
    let newText = text;
    if (text && text.value !== undefined) {
      newText = text.value;
    }
    return newText;
  }

  useEffect(() => {
    subscribed.current = true;
    setLoading(true);

    async function loadData() {
      const { data } = await categoryHttp.list({
        queryParams: {
          search: cleanSearchText(filterState.search),
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

    loadData();
    return () => {
      subscribed.current = false;
    };
  }, [
    filterState.search,
    filterState.pagination.page,
    filterState.pagination.per_page,
    filterState.order,
  ]);

  return (
    <GridView
      title={btnAdd}
      columns={columns}
      data={data}
      loading={loading}
      debouncedSearchTime={300}
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
        onSearchChange: value =>
          dispatch(Creators.setSearch({ search: value })),
        onChangePage: page => dispatch(Creators.setPage({ page: page + 1 })),
        onChangeRowsPerPage: perPage =>
          dispatch(Creators.setPerPage({ per_page: perPage })),
        onColumnSortChange: (changedColumn, direction) =>
          dispatch(
            Creators.setOrder({
              sort: changedColumn,
              dir: direction.includes('desc') ? 'desc' : 'asc',
            })
          ),
      }}
    />
  );
}
