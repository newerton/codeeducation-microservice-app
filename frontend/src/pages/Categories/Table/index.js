import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Chip, CircularProgress, Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MUIDataTable from 'mui-datatables';

import categoryHttp from '../../../util/http/category-http';

const columnsDefinitions = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'is_active',
    label: 'Ativo?',
    options: {
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
    options: {
      customBodyRender(value) {
        return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
      },
    },
  },
];

const options = {
  textLabels: {
    body: {
      noMatch: (
        <CircularProgress
          size={24}
          style={{ marginLeft: 15, position: 'relative', top: 4 }}
        />
      ),
    },
  },
};

const btnAdd = (
  <Button
    variant="outlined"
    color="primary"
    component={Link}
    to="/categories/create"
  >
    Adicionar
  </Button>
);

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await categoryHttp.list();
      setData(response.data.data);
    }

    loadData();
  }, []);

  return (
    <MUIDataTable
      title={btnAdd}
      columns={columnsDefinitions}
      data={data}
      options={options}
    />
  );
}
