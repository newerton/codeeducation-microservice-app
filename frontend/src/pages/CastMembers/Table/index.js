import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { CircularProgress, Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MUIDataTable from 'mui-datatables';

import http from '../../../util/http';

const CastMembersTypeMap = {
  1: 'Diretor',
  2: 'Autor',
};
const columnsDefinitions = [
  {
    name: 'name',
    label: 'Nome',
  },
  {
    name: 'type',
    label: 'Tipo',
    options: {
      customBodyRender(value) {
        return CastMembersTypeMap[value];
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
    to="/cast-members/create"
  >
    Adicionar
  </Button>
);

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await http.get('cast_members');
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
