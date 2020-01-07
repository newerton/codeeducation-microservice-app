import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';

const columnsDefinitions = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "is_active",
    label: "Ativo?"
  },
  {
    name: "created_at",
    label: "Criado em"
  }
];

export default function Table() {

  const [data, setData] = useState([]);

  return (
    <MUIDataTable
      title="Categorias"
      columns={columnsDefinitions}
      data={data}
    />
  );
}
