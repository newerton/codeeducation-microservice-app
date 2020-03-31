import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { invert } from 'lodash';
import * as Yup from 'yup';

import Delete from '~/components/Dialog/Delete';
import GridView from '~/components/GridView';
import FilterResetButton from '~/components/GridView/FilterResetButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import useDeleteCollection from '~/hooks/useDeleteCollection';
import useFilter from '~/hooks/useFilter';
import castMemberHttp from '~/util/http/castMember-http';
import { CastMembersTypeMap } from '~/util/models';
import toast from '~/util/toast';

const castMemberNames = Object.values(CastMembersTypeMap);

const columnsDefinitions = [
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
      customBodyRender(value) {
        return CastMembersTypeMap[value];
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
      sort: false,
      filter: false,
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
    extraFilter: {
      createValidationSchema: () => {
        return Yup.object().shape({
          type: Yup.string()
            .nullable()
            .transform(value => {
              return !value || !castMemberNames.includes(value)
                ? undefined
                : value;
            })
            .default(null),
        });
      },
      formatSearchParams: debouncedState => {
        return debouncedState.extraFilter
          ? {
              ...(debouncedState.extraFilter.type && {
                type: debouncedState.extraFilter.type,
              }),
            }
          : undefined;
      },
      getStateFromURL: queryParams => {
        return { type: queryParams.get('type') };
      },
    },
  });

  const indexColumnType = columns.findIndex(c => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue =
    filterState.extraFilter && filterState.extraFilter.type;
  columnType.options.filterList = typeFilterValue ? [typeFilterValue] : [];
  const serverSideFilterList = columns.map(() => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }

  async function loadData() {
    const response = await castMemberHttp.list({
      queryParams: {
        search: filterManager.cleanSearchText(filterState.search),
        page: filterState.pagination.page,
        per_page: filterState.pagination.per_page,
        sort: filterState.order.sort,
        dir: filterState.order.dir,
        ...(debouncedFilterState.extraFilter &&
          debouncedFilterState.extraFilter.type && {
            type: invert(CastMembersTypeMap)[
              debouncedFilterState.extraFilter.type
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
    await castMemberHttp
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
