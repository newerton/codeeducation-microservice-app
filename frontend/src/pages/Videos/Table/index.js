import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import { invert } from 'lodash';

import Delete from '~/components/Dialog/Delete';
import GridView from '~/components/GridView/';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import useDeleteCollection from '~/hooks/useDeleteCollection';
import useFilter from '~/hooks/useFilter';
import videoHttp from '~/util/http/video-http';
import { IsActiveMap } from '~/util/models';
import toast from '~/util/toast';

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
    name: 'genres',
    label: 'Gêneros',
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value) {
        return value.map(genre => genre.name).join(', ');
      },
    },
  },
  {
    name: 'categories',
    label: 'Categorias',
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: [],
      },
      customBodyRender(value) {
        return value.map(category => category.name).join(', ');
      },
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
  const loading = useContext(LoadingContext);
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();

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
    const response = await videoHttp.list({
      queryParams: {
        search: filterManager.cleanSearchText(filterState.search),
        page: filterState.pagination.page,
        per_page: filterState.pagination.per_page,
        sort: filterState.order.sort,
        dir: filterState.order.dir,
        ...(debouncedFilterState.extraFilter &&
          debouncedFilterState.extraFilter.is_active && {
            is_active: invert(IsActiveMap)[
              debouncedFilterState.extraFilter.is_active
            ],
          }),
      },
    });

    if (subscribed.current) {
      setData(response.data.data);
      setTotalRecords(response.data.meta.total);
      if (openDeleteDialog) {
        setOpenDeleteDialog(false);
      }
    }
  }

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    loadData();
    return () => {
      subscribed.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-line
    filterManager.cleanSearchText(debouncedFilterState.search), // eslint-disable-line
    debouncedFilterState.pagination.page, // eslint-disable-line
    debouncedFilterState.pagination.per_page, // eslint-disable-line
    debouncedFilterState.order, // eslint-disable-line
    JSON.stringify(debouncedFilterState.extraFilter), // eslint-disable-line
  ]); // eslint-disable-line

  async function deleteRows(confirmed) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return false;
    }

    const ids = rowsToDelete.data.map(value => data[value.index].id).join(',');
    await videoHttp
      .deleteCollection({ ids })
      .then(() => {
        if (
          rowsToDelete.data.length === filterState.pagination.per_page &&
          filterState.pagination.page > 1
        ) {
          const page = filterState.pagination.page - 2;
          filterManager.changePage(page);
        } else {
          loadData();
        }
        toast.success('Registros excluídos com sucesso');
      })
      .catch(() => toast.error('Não foi possível excluir os registros'));
    return true;
  }

  return (
    <>
      <Delete open={openDeleteDialog} handleClose={deleteRows} />
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
            <FilterResetButton
              handleClick={() => filterManager.resetFilter()}
            />
          ),
          onSearchChange: value => filterManager.changeSearch(value),
          onChangePage: page => filterManager.changePage(page),
          onChangeRowsPerPage: perPage =>
            filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn, direction) =>
            filterManager.changeColumnSort(changedColumn, direction),
          onRowsDelete: rowsDeleted => {
            setRowsToDelete(rowsDeleted);
            return false;
          },
        }}
      />
    </>
  );
}
