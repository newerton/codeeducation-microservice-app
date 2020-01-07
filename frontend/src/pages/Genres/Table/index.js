import React, { useState, useEffect } from "react";
import { Chip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import http from "../../../util/http";
import { format, parseISO } from "date-fns";

const columnsDefinitions = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        const mapCategories = value.map(value => value.name);
        const categories =
          mapCategories.slice(0, -1).join(", ") + " e " + mapCategories.pop();
        return categories;
      }
    }
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value ? (
          <Chip label="Sim" color="primary" />
        ) : (
          <Chip label="Não" color="secondary" />
        );
      }
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>;
      }
    }
  }
];

export default function Table() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const response = await http.get("genres");
      setData(response.data.data);
    }

    loadData();
  }, []);

  return (
    <MUIDataTable title="Gêneros" columns={columnsDefinitions} data={data} />
  );
}
