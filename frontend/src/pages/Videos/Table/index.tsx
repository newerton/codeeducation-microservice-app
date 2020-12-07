import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import { ListResponse, Video } from '../../../util/models';
import LoadingContext from '../../../components/Loading/LoadingContext';
import useDeleteCollection from '../../../hooks/useDeleteCollection';
import DefaultTable, {
  MuiDataTableRefComponent,
  TableColumn,
} from '../../../components/Table';
import useFilter from '../../../hooks/useFilter';
import videoHttp from '../../../util/http/video-http';
import DeleteDialog from '../../../components/DeleteDialog';
import FilterResetButton from '../../../components/Table/FilterResetButton';

const columnsDefinition: TableColumn[] = [
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
      customBodyRender(value: any) {
        return value.map((genre) => genre.name).join(', ');
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
      customBodyRender(value: any) {
        return value.map((category) => category.name).join(', ');
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
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [10, 25, 50];

const Table = () => {
  const { enqueueSnackbar } = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<Video[]>([]);
  const loading = useContext(LoadingContext);
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();
  const tableRef = useRef() as MutableRefObject<MuiDataTableRefComponent>;

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
  });

  const searchText = cleanSearchText(debouncedFilterState.search);

  const getData = useCallback(
    async ({ search, page, per_page, sort, dir }) => {
      try {
        const { data } = await videoHttp.list<ListResponse<Video>>({
          queryParams: {
            search,
            page,
            per_page,
            sort,
            dir,
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
        if (videoHttp.isCancelledRequest(error)) {
          return;
        }
        enqueueSnackbar('Não foi possível carregar as informações.', {
          variant: 'error',
        });
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
  ]);

  function deleteRows(confirmed: boolean) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }

    const ids = rowsToDelete.data
      .map((value) => data[value.index].id)
      .join(',');

    videoHttp
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
          getData({
            search: searchText,
            page: debouncedFilterState.pagination.page,
            per_page: debouncedFilterState.pagination.per_page,
            sort: debouncedFilterState.order.sort,
            dir: debouncedFilterState.order.dir,
          });
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
                  ? filterList[columnIndex][0]
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
