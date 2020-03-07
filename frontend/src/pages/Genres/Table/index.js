import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Chip, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import * as Yup from 'yup';

import Delete from '~/components/Dialog/Delete';
import GridView from '~/components/GridView';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import useDeleteCollection from '~/hooks/useDeleteCollection';
import useFilter from '~/hooks/useFilter';
import categoryHttp from '~/util/http/category-http';
import genreHttp from '~/util/http/genre-http';
import toast from '~/util/toast';

const columnsDefinitions = [
  {
    name: 'id',
    label: 'ID',
    width: '30%',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
    width: '23%',
    options: {
      filter: false,
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
    name: 'is_active',
    label: 'Ativo?',
    width: '5%',
    options: {
      filter: false,
      filterOptions: {
        names: ['Sim', 'Não'],
      },
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
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <span>
            <IconButton
              color="secondary"
              component={Link}
              to={`/genres/${tableMeta.rowData[0]}/edit`}
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
    to="/genres/create"
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
  // const [categories, setCategories] = useState([]);
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
    extraFilter: {
      createValidationSchema: () => {
        return Yup.object().shape({
          categories: Yup.mixed()
            .nullable()
            .transform(value => {
              return !value || value === '' ? undefined : value.split(',');
            })
            .default(null),
          is_active: Yup.string()
            .nullable()
            .transform(value => {
              return !value || value === '' ? undefined : value;
            })
            .default(null),
        });
      },
      formatSearchParams: debouncedState => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.categories && {
                categories: debouncedState.extraFilter.categories.join(','),
              }),
              ...(debouncedState.extraFilter.is_active && {
                is_active: debouncedState.extraFilter.is_active,
              }),
            }
          : undefined;
      },
      getStateFromURL: queryParams => {
        return {
          categories: queryParams.get('categories'),
          is_active: queryParams.get('is_active'),
        };
      },
    },
  });

  const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue =
    filterState.extraFilter && filterState.extraFilter.categories;
  columnCategories.options.filterList = categoriesFilterValue || [];
  const serverSideFilterList = columns.map(column => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }

  const indexColumnIsActive = columns.findIndex(c => c.name === 'is_active');
  const columnIsActive = columns[indexColumnIsActive];
  const isActiveFilterValue =
    filterState.extraFilter && filterState.extraFilter.isActive;
  columnIsActive.options.filterList = isActiveFilterValue || [];
  if (isActiveFilterValue) {
    serverSideFilterList[indexColumnIsActive] = isActiveFilterValue;
  }

  async function loadData() {
    const { data } = await genreHttp.list({
      queryParams: {
        search: filterManager.cleanSearchText(filterState.search),
        page: filterState.pagination.page,
        per_page: filterState.pagination.per_page,
        sort: filterState.order.sort,
        dir: filterState.order.dir,
        ...(debouncedFilterState.extraFilter &&
          debouncedFilterState.extraFilter.categories && {
            categories: debouncedFilterState.extraFilter.categories,
          }),
      },
    });

    if (subscribed.current) {
      setData(data.data);
      setTotalRecords(data.meta.total);
      if (openDeleteDialog) {
        setOpenDeleteDialog(false);
      }
    }
  }

  async function loadCategories(isSubscriber) {
    const response = await categoryHttp.list({ queryParam: { all: '' } });
    if (isSubscriber) {
      // setCategories(data.data);
      columnCategories.options.filterOptions.names = response.data.data.map(
        category => category.name
      );
    }
  }

  useEffect(() => {
    let isSubscribed = true;
    loadCategories(isSubscribed);
    return () => {
      isSubscribed = false;
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    loadData();
    return () => {
      subscribed.current = false;
    };
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
    await genreHttp
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
          serverSideFilterList,
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
                  ? filterList[columnIndex]
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
