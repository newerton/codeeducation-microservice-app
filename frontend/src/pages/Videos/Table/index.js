import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';

import GridView from '~/components/GridView/';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import useFilter from '~/hooks/useFilter';
import videoHttp from '~/util/http/video-http';

const columnsDefinitions = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'title',
    label: 'Título',
    width: '43%',
    options: {
      filter: false,
    },
  },
  {
    name: 'year_launched',
    label: 'Ano de lançamento',
    width: '5%',
    options: {
      filter: false,
    },
  },
  {
    name: 'rating',
    label: 'Classificação',
    width: '5%',
    options: {
      filter: false,
    },
  },
  {
    name: 'created_at',
    label: 'Criado em',
    width: '10%',
    options: {
      filter: false,
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
      filter: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <span>
            <IconButton
              color="secondary"
              component={Link}
              to={`/videos/${tableMeta.rowData[0]}/edit`}
            >
              <EditIcon />
            </IconButton>
          </span>
        );
      },
    },
  },
];

const btnAdd = (
  <Button
    variant="outlined"
    color="primary"
    component={Link}
    to="/videos/create"
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
  const tableRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinitions,
    debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
  });

  async function loadData() {
    const { data } = await videoHttp.list({
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
  }, [ // eslint-disable-line
    filterManager.cleanSearchText(debouncedFilterState.search), // eslint-disable-line
    debouncedFilterState.pagination.page, // eslint-disable-line
    debouncedFilterState.pagination.per_page, // eslint-disable-line
    debouncedFilterState.order, // eslint-disable-line
    JSON.stringify(debouncedFilterState.extraFilter), // eslint-disable-line
  ]); // eslint-disable-line

  return (
    <GridView
      title={btnAdd}
      columns={columns}
      data={data}
      loading={loading}
      debouncedSearchTime={debounceSearchTime}
      ref={tableRef}
      options={{
        serverSide: true,
        responsive: 'scrollMaxHeight',
        searchText: filterState.search,
        page: filterState.pagination.page - 1,
        rowsPerPage: filterState.pagination.per_page,
        rowsPerPageOptions,
        count: totalRecords,
        onFilterChange: (column, filterList, type) => {
          if (type === 'reset') {
            filterManager.resetFilter();
            return;
          }
          const columnIndex = columns.findIndex(c => c.name === column);
          filterManager.changeExtraFilter({
            [column]:
              filterList[columnIndex] && filterList[columnIndex].length
                ? filterList[columnIndex][0]
                : null,
          });
        },
        customToolbar: () => (
          <FilterResetButton handleClick={() => filterManager.resetFilter()} />
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
