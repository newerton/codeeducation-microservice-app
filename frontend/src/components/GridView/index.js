import React from 'react';

import {
  useTheme,
  MuiThemeProvider,
  CircularProgress,
} from '@material-ui/core';
import { merge, omit, cloneDeep } from 'lodash';
import MUIDataTable from 'mui-datatables';
import PropTypes from 'prop-types';

const defaultOptions = {
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
};

export default function GridView({ ...props }) {
  const theme = cloneDeep(useTheme());

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
  const newProps = merge({ options: cloneDeep(defaultOptions) }, props, {
    columns: extractMuiDataTableColumns(props),
  });

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
