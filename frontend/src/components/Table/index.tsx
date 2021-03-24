import React from 'react';

import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from 'mui-datatables';
import DebouncedTableSearch from '../Table/DebouncedTableSearch';
import { cloneDeep, merge, omit } from 'lodash';
import {
  MuiThemeProvider,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

export interface TableColumn extends MUIDataTableColumn {
  width?: string;
}

export interface MuiDataTableRefComponent {
  changePage: (page: number) => void;
  changeRowsPerPage: (rowsPerPage: number) => void;
}

export interface TableProps
  extends MUIDataTableProps,
    React.RefAttributes<MuiDataTableRefComponent> {
  columns: TableColumn[];
  loading?: boolean;
  debouncedSearchTime?: number;
}

const makeDefaultOptions = (debouncedSearchTime?): MUIDataTableOptions => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: 'Nenhum registro encontrado',
      toolTip: 'Classificar',
    },
    pagination: {
      next: 'Próxima página',
      previous: 'Página anterior',
      rowsPerPage: 'Por página:',
      displayRows: 'de',
    },
    toolbar: {
      search: 'Busca',
      downloadCsv: 'Download CSV',
      print: 'Imprimir',
      viewColumns: 'Ver Colunas',
      filterTable: 'Filtrar Tabelas',
    },
    filter: {
      all: 'Todos',
      title: 'FILTROS',
      reset: 'LIMPAR',
    },
    viewColumns: {
      title: 'Ver Colunas',
      titleAria: 'Ver/Esconder Colunas da Tabela',
    },
    selectedRows: {
      text: 'registro(s) selecionados',
      delete: 'Excluir',
      deleteAria: 'Excluir registros selecionados',
    },
  },
  customSearchRender: (
    searchText: string,
    handleSearch: any,
    hideSearch: any,
    options: any,
  ) => {
    return (
      <DebouncedTableSearch
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        options={options}
        debounceTime={debouncedSearchTime}
      />
    );
  },
});

const Table = React.forwardRef<MuiDataTableRefComponent, TableProps>(
  (props, ref) => {
    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));

    const defaultOptions = makeDefaultOptions(props.debouncedSearchTime);

    const newProps = merge({ options: cloneDeep(defaultOptions) }, props, {
      columns: extractMuiDataTableColumns(props.columns),
    });

    function extractMuiDataTableColumns(
      columns: TableColumn[],
    ): MUIDataTableColumn[] {
      setColumnsWitdh(columns);
      return columns.map((column) => omit(column, 'width'));
    }

    function setColumnsWitdh(columns: TableColumn[]) {
      columns.forEach((column, key) => {
        if (column.width) {
          // const overrides = theme.overrides as any;
          // overrides.MUIDataTableHeadCell.fixedHeader[
          //   `&:nth-child(${key + 2})`
          // ] = {
          //   width: column.width,
          // };
        }
      });
    }

    function applyLoading() {
      const textLabels = (newProps.options as any).textLabels;

      textLabels.body.noMatch =
        newProps.loading === true ? 'Carregando...' : textLabels.body.noMatch;
    }

    function applyResponsive() {
      newProps.options.responsive = isSmOrDown ? 'standard' : 'simple';
    }

    function getOriginalMuiDataTableProps() {
      return {
        ...omit(newProps, 'loading'),
        ref,
      };
    }

    applyLoading();
    applyResponsive();

    const originalProps = getOriginalMuiDataTableProps();

    return (
      <MuiThemeProvider theme={theme}>
        <MUIDataTable {...originalProps} />
      </MuiThemeProvider>
    );
  },
);

export default Table;
