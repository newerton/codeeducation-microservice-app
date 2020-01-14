import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Chip, CircularProgress, Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';

import GridView from '~/components/GridView/';
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
  const [searchState, setSearchState] = useState({
    search: '',
    pagination: {
      page: 1,
      total: 0,
      per_page: 15,
    },
    order: {
      sort: null,
      dir: null,
    },
  });

  const columns = columnsDefinitions.map(column => {
    return column.name === searchState.order.sort
      ? {
          ...column,
          options: {
            ...column.options,
            sortDirection: searchState.order.dir,
          },
        }
      : column;
  });

  useEffect(() => {
    subscribed.current = true;
    setLoading(true);

    async function loadData() {
      const { data } = await categoryHttp.list({
        queryParams: {
          search: searchState.search,
          page: searchState.pagination.page,
          per_page: searchState.pagination.per_page,
          sort: searchState.order.sort,
          dir: searchState.order.dir,
        },
      });

      if (subscribed.current) {
        setData(data.data);
        setSearchState(prevState => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            total: data.meta.total,
          },
        }));
        setLoading(false);
      }
    }

    loadData();
    return () => {
      subscribed.current = false;
    };
  }, [
    searchState.search,
    searchState.pagination.page,
    searchState.pagination.per_page,
    searchState.order,
  ]);

  return (
    <GridView
      title={btnAdd}
      columns={columnsDefinitions}
      data={data}
      loading={loading}
    />
  );
}
