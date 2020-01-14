import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Chip, CircularProgress, Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MUIDataTable from 'mui-datatables';

import http from '~/util/http';

const columnsDefinitions = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'categories',
    label: 'Categorias',
    options: {
      customBodyRender(value) {
        const mapCategories = value.map(val => val.name);
        const categories = `${mapCategories
          .slice(0, -1)
          .join(', ')} e ${mapCategories.pop()}`;
        return categories;
      },
    },
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
    to="/genres/create"
  >
    Adicionar
  </Button>
);

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    async function loadData() {
      const response = await http.get('genres');
      if (isSubscribed) {
        setData(response.data.data);
      }
    }

    loadData();
    return () => {
      isSubscribed = false;
    };
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
