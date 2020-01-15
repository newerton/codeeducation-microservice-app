import React from 'react';

import {
  CircularProgress,
  MuiThemeProvider,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { cloneDeep, merge, omit } from 'lodash';
import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';

import DebouncedTableSearch from './DebouncedTableSearch';

const makeDefaultOptions = debouncedSearchTime => ({
  print: false,
  download: false,
  textLabels: {
    body: {
      noMatch: 'Nenhum registro encontrado',
      toolTip: 'Classificar',
      columnHeaderTooltip: column => `Ordenado por ${column.label}`,
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
      text: 'registros(s) selecionados',
      delete: 'Excluir',
      deleteAria: 'Excluir registros selecionados',
    },
  },
  customSearchRender: (searchText, handleSearch, hideSearch, options) => {
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

export default function GridView({ ...props }) {
  const theme = cloneDeep(useTheme());
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  function setColumnWidth(columns) {
    columns.forEach((column, key) => {
      if (column.width) {
        const { overrides } = theme;
        const child = `&:nth-child(${key + 2})`;
        overrides.MUIDataTableHeadCell.fixedHeaderCommon[child] = {
          width: column.width,
        };
      }
    });
  }

  function extractMuiDataTableColumns(prop) {
    setColumnWidth(prop.columns);
    return prop.columns.map(column => omit(column, 'width'));
  }

  const defaultOptions = makeDefaultOptions(props.debouncedSearchTime);
  const newProps = merge({ options: cloneDeep(defaultOptions) }, props, {
    columns: extractMuiDataTableColumns(props),
  });

  function applyResponsive() {
    newProps.options.responsive = isSmall ? 'scrollMaxHeight' : 'stacked';
  }

  function applyLoading() {
    const { textLabels } = newProps.options;
    textLabels.body.noMatch =
      newProps.loading === true ? (
        <CircularProgress
          size={24}
          style={{ marginLeft: 15, position: 'relative', top: 4 }}
        />
      ) : (
        textLabels.body.noMatch
      );
  }

  function getOriginalMuiDataTableProps() {
    return omit(newProps, 'loading');
  }

  applyLoading();
  applyResponsive();

  const originalProps = getOriginalMuiDataTableProps();
  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...originalProps} />
    </MuiThemeProvider>
  );
}

GridView.propTtypes = {
  props: PropTypes.object,
};
