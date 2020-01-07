import React from 'react';
import Dashboard from '../pages/Dashboard';
import CategoriesList from '../pages/Categories/List';
import CastMembersList from '../pages/CastMembers/List';
import GenresList from '../pages/Genres/List';
import { DashboardRounded, CategoryRounded } from '@material-ui/icons';

const routes = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: (<DashboardRounded />),
    path: '/',
    component: Dashboard,
    exact: true,
  },
  {
    name: 'categories.list',
    label: 'Categorias',
    icon: (<CategoryRounded />),
    path: '/categories',
    component: CategoriesList,
    exact: true,
  }
];

export default routes;
