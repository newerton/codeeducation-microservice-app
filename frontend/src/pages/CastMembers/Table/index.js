import React, { useState, useEffect } from 'react';
import { Chip } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import http from '../../../util/http';
import { format, parseISO } from 'date-fns';

const columnsDefinitions = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <Chip label="Sim" color="primary" /> : <Chip label="Não" color="secondary" />
      }
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
      }
    }
  }
];

export default function Table() {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await http.get('categories');
      setData(response.data.data);
    }

    loadData();
  }, []);

  return (
    <MUIDataTable
      title="Categorias"
      columns={columnsDefinitions}
      data={data}
    />
  );
}
