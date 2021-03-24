import React, { useEffect, useCallback, useRef, useState, useContext, MutableRefObject, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { format, parseISO } from 'date-fns';
import { invert } from 'lodash';
import * as Yup from 'yup';

import DefaultTable, {
  MuiDataTableRefComponent,
  TableColumn,
} from '../../../components/Table';
import { useSnackbar } from 'notistack';
import {
  CastMember,
  CastMemberTypeMap,
  ListResponse,
} from '../../../util/models';
import DeleteDialog from '../../../components/DeleteDialog';
import LoadingContext from '../../../components/Loading/LoadingContext';
import useDeleteCollection from '../../../hooks/useDeleteCollection';
import useFilter from '../../../hooks/useFilter';
import castMemberHttp from '../../../util/http/cast-member-http';
import FilterResetButton from '../../../components/Table/FilterResetButton';

const castMemberNames = Object.values(CastMemberTypeMap);

const columnsDefinition: TableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: 'name',
    label: 'Nome',
    options: {
      filter: false,
    },
  },
  {
    name: 'type',
    label: 'Tipo',
    width: '4%',
    options: {
      filterOptions: {
        names: castMemberNames,
      },
      customBodyRender(value, tableMeta, updateValue) {
        return CastMemberTypeMap[value] !== undefined ? (
          <span>{CastMemberTypeMap[value]}</span>
        ) : (
          '-'
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
      customBodyRender(value, tableMeta, updateValue) {
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
          <IconButton
            color={'secondary'}
            component={Link}
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon />
          </IconButton>
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
    to="/cast-members/create"
  >
    Adicionar
  </Button>
);

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 10;
const rowsPerPageOptions = [10, 25, 50];

const Table: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<CastMember[]>([]);
  const loading = useContext(LoadingContext);
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    rowsToDelete,
    setRowsToDelete,
  } = useDeleteCollection();
  const tableRef = useRef() as MutableRefObject<
    MuiDataTableRefComponent
  >;
  const extraFilter = useMemo(
    () => ({
      createValidationSchema: () => {
        return Yup.object().shape({
          type: Yup.string()
            .nullable()
            .transform((value) =>
              !value || castMemberNames.includes(value) ? undefined : value,
            )
            .default(null),
        });
      },
      formatSearchParams: (debouncedFilterState) => {
        return debouncedFilterState.extraFilter
          ? {
              ...(debouncedFilterState.extraFilter.type && {
                type: debouncedFilterState.extraFilter.type,
              }),
            }
          : undefined;
      },
      getStateFromUrl: (queryParams) => {
        return {
          type: queryParams.get('type'),
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
  const indexColumnType = columns.findIndex((c) => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue =
    filterState.extraFilter && (filterState.extraFilter.type as never);
  (columnType.options as any).filterList = typeFilterValue
    ? [typeFilterValue]
    : [];

  const serverSideFilterList = columns.map((c) => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

  const getData = useCallback(
    async ({ search, page, per_page, sort, dir, type }) => {
      try {
        const { data } = await castMemberHttp.list<ListResponse<CastMember>>({
          queryParams: {
            search,
            page,
            per_page,
            sort,
            dir,
            ...(type && {
              type: invert(CastMemberTypeMap)[type],
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
        if (castMemberHttp.isCancelledRequest(error)) {
          enqueueSnackbar('Não foi possível carregar as informações.', {
            variant: 'error',
          });
        }
      }
    },
    [openDeleteDialog, enqueueSnackbar, setOpenDeleteDialog, setTotalRecords],
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
        debouncedFilterState.extraFilter.type && {
          type: debouncedFilterState.extraFilter.type,
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

  async function deleteRows(confirmed: boolean) {
    if (!confirmed) {
      setOpenDeleteDialog(false);
      return;
    }

    const ids = rowsToDelete.data
      .map((value) => data[value.index].id)
      .join(',');

    castMemberHttp
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
              [column]: filterList[columnIndex].length
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
          onColumnSortChange: (changedColumn: string, direction: string) =>
            filterManager.changeColumnSort(changedColumn, direction),
          onRowsDelete: (rowsDeleted) => {
            setRowsToDelete(rowsDeleted as any);
            return false;
          },
        }}
      />
    </>
  );
};

export default Table;
