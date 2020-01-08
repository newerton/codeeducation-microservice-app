import React from "react";
import Dashboard from "../pages/Dashboard";
import CategoriesList from "../pages/Categories/List";
import CategoriesForm from "../pages/Categories/Form";
import CastMembersList from "../pages/CastMembers/List";
import GenresList from "../pages/Genres/List";
import {
  DashboardRounded,
  CategoryRounded,
  PersonRounded
} from "@material-ui/icons";

const routes = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: <DashboardRounded />,
    path: "/",
    component: Dashboard,
    exact: true
  },
  {
    name: "categories.list",
    label: "Categorias",
    icon: <CategoryRounded />,
    path: "/categories",
    component: CategoriesList,
    exact: true
  },
  {
    name: "categories.create",
    label: "Adicionar categorias",
    icon: <CategoryRounded />,
    path: "/categories/create",
    component: CategoriesForm,
    exact: true
  },
  {
    name: "cast_members.list",
    label: "Membros de elencos",
    icon: <PersonRounded />,
    path: "/cast-members",
    component: CastMembersList,
    exact: true
  },
  {
    name: "cast_members.create",
    label: "Adicionar Membros de elencos",
    icon: <PersonRounded />,
    path: "/cast-members/create",
    component: CastMembersList,
    exact: true
  },
  {
    name: "genres.list",
    label: "Gêneros",
    icon: <CategoryRounded />,
    path: "/genres",
    component: GenresList,
    exact: true
  },
  {
    name: "genres.create",
    label: "Adicionar Gêneros",
    icon: <CategoryRounded />,
    path: "/genres/create",
    component: GenresList,
    exact: true
  }
];

export default routes;
