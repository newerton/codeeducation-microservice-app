import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { Button, Chip, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Category, Genre, ListResponse } from '../../../util/models';
import LoadingContext from '../../../components/Loading/LoadingContext';
import useDeleteCollection from '../../../hooks/useDeleteCollection';
import DefaultTable, {
  MuiDataTableRefComponent,
  TableColumn,
} from '../../../components/Table';
import useFilter from '../../../hooks/useFilter';
import categoryHttp from '../../../util/http/category-http';
import genreHttp from '../../../util/http/genre-http';
import DeleteDialog from '../../../components/DeleteDialog';
import FilterResetButton from '../../../components/Table/FilterResetButton';

const columnsDefinition: TableColumn[] = [
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
      customBodyRender(value: any) {
        return value.map((category) => category.name).join(', ');
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
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [10, 25, 50];

const Table = () => {
  const { enqueueSnackbar } = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<Genre[]>([]);
  const [, setCategories] = useState<Category[]>([]);
  const loading = useContext(LoadingContext);
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();
  const tableRef = useRef() as MutableRefObject<MuiDataTableRefComponent>;
  const extraFilter = useMemo(
    () => ({
      createValidationSchema: () => {
        return Yup.object().shape({
          categories: Yup.mixed()
            .nullable()
            .transform((value) =>
              !value || value === '' ? undefined : value.split(','),
            )
            .default(null),
        });
      },
      formatSearchParams: (debouncedFilterState) => {
        return debouncedFilterState.extraFilter
          ? {
              ...(debouncedFilterState.extraFilter.categories && {
                categories: debouncedFilterState.extraFilter.categories.join(
                  ',',
                ),
              }),
            }
          : undefined;
      },
      getStateFromUrl: (queryParams) => {
        return {
          categories: queryParams.get('categories'),
        };
      },
    }),
    [],
  );

  const {
    columns,
    cleanSearchText,
    filterManager,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords,
  } = useFilter({
    columns: columnsDefinition,
    debounceTime: debounceTime,
    rowsPerPage,
    rowsPerPageOptions,
    tableRef,
    extraFilter,
  });

  const searchText = cleanSearchText(debouncedFilterState.search);
  const indexColumnCategories = columns.findIndex(
    (c) => c.name === 'categories',
  );
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue =
    filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue
    ? categoriesFilterValue
    : [];
  const serverSideFilterList = columns.map((column) => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }

  React.useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const { data } = await categoryHttp.list({ queryParams: { all: '' } });
        if (isSubscribed) {
          setCategories(data.data);
          (columnCategories.options as any).filterOptions.names = data.data.map(
            (category) => category.name,
          );
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Não foi possível carregar as informações.', {
          variant: 'error',
        });
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [columnCategories.options, enqueueSnackbar]);

  const getData = React.useCallback(
    async ({ search, page, per_page, sort, dir, type }) => {
      try {
        const { data } = await genreHttp.list<ListResponse<Genre>>({
          queryParams: {
            search,
            page,
            per_page,
            sort,
            dir,
            ...(type && {
              categories: type,
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
      } catch (error) {
        console.error(error);
        if (genreHttp.isCancelledRequest(error)) {
          enqueueSnackbar('Não foi possível carregar as informações.', {
            variant: 'error',
          });
        }
      }
    },
    [enqueueSnackbar, setTotalRecords, openDeleteDialog, setOpenDeleteDialog],
  );

  useEffect(() => {
    subscribed.current = true;
    getData({
      search: searchText,
      page: debouncedFilterState.pagination.page,
      per_page: debouncedFilterState.pagination.per_page,
      sort: debouncedFilterState.order.sort,
      dir: debouncedFilterState.order.dir,
      ...(debouncedFilterState.extraFilter &&
        debouncedFilterState.extraFilter.categories && {
          categories: debouncedFilterState.extraFilter.categories.join(','),
        }),
    });
    return () => {
      subscribed.current = false;
    };
  }, [
    getData,
    searchText,
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order,
    debouncedFilterState.extraFilter,
  ]);

  function deleteRows(confirmed: boolean) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }

    const ids = rowsToDelete.data
      .map((value) => data[value.index].id)
      .join(',');

    genreHttp
      .deleteCollection({ ids })
      .then((response) => {
        enqueueSnackbar('Registros excluidos com sucesso!', {
          variant: 'success',
        });
        if (
          rowsToDelete.data.length === filterState.pagination.per_page &&
          filterState.pagination.page > 1
        ) {
          const page = filterState.pagination.page - 2;
          filterManager.changePage(page);
        } else {
          //getData()
        }
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Não foi possível excluir os registros', {
          variant: 'error',
        });
      });
  }

  return (
    <>
      <DeleteDialog open={openDeleteDialog} handleClose={deleteRows} />
      <DefaultTable
        title={btnAdd}
        columns={columns}
        data={data}
        loading={loading}
        debouncedSearchTime={debouncedSearchTime}
        ref={tableRef}
        options={{
          // serverSideFilterList,
          serverSide: true,
          responsive: 'standard',
          searchText: filterState.search as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
          onFilterChange: (column: any, filterList, type) => {
            if (type === 'reset') {
              filterManager.resetFilter();
              return;
            }
            const columnIndex = columns.findIndex((c) => c.name === column);
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
          onSearchChange: (value) => filterManager.changeSearch(value),
          onChangePage: (page) => filterManager.changePage(page),
          onChangeRowsPerPage: (perPage) =>
            filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn, direction) =>
            filterManager.changeColumnSort(changedColumn, direction),
          onRowsDelete: (rowsDeleted) => {
            setRowsToDelete(rowsDeleted);
            return false;
          },
        }}
      />
    </>
  );
};

export default Table;
