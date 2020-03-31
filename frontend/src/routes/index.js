import React from 'react';

import {
  DashboardRounded,
  CategoryRounded,
  PersonRounded,
  VideocamRounded,
} from '@material-ui/icons';

import CastMembersForm from '../pages/CastMembers/Form';
import CastMembersList from '../pages/CastMembers/List';
import CategoriesForm from '../pages/Categories/Form';
import CategoriesList from '../pages/Categories/List';
import Dashboard from '../pages/Dashboard';
import GenresForm from '../pages/Genres/Form';
import GenresList from '../pages/Genres/List';
import VideosForm from '../pages/Videos/Form';
import VideosList from '../pages/Videos/List';

const routes = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardRounded />,
    path: '/',
    component: Dashboard,
    exact: true,
  },
  // Categorias
  {
    name: 'categories.list',
    label: 'Categorias',
    icon: <CategoryRounded />,
    path: '/categories',
    component: CategoriesList,
    exact: true,
  },
  {
    name: 'categories.create',
    label: 'Adicionar categorias',
    icon: <CategoryRounded />,
    path: '/categories/create',
    component: CategoriesForm,
    exact: true,
  },
  {
    name: 'categories.edit',
    label: 'Editar categoria',
    icon: <CategoryRounded />,
    path: '/categories/:id/edit',
    component: CategoriesForm,
    exact: true,
  },
  // Membros de Elencos
  {
    name: 'cast_members.list',
    label: 'Membros de elencos',
    icon: <PersonRounded />,
    path: '/cast-members',
    component: CastMembersList,
    exact: true,
  },
  {
    name: 'cast_members.create',
    label: 'Adicionar membros de elencos',
    icon: <PersonRounded />,
    path: '/cast-members/create',
    component: CastMembersForm,
    exact: true,
  },
  {
    name: 'cast_members.edit',
    label: 'Editar membros de elencos',
    icon: <CategoryRounded />,
    path: '/cast-members/:id/edit',
    component: CastMembersForm,
    exact: true,
  },
  // Gêneros
  {
    name: 'genres.list',
    label: 'Gêneros',
    icon: <CategoryRounded />,
    path: '/genres',
    component: GenresList,
    exact: true,
  },
  {
    name: 'genres.create',
    label: 'Adicionar gêneros',
    icon: <CategoryRounded />,
    path: '/genres/create',
    component: GenresForm,
    exact: true,
  },
  {
    name: 'genres.edit',
    label: 'Editar gêneros',
    icon: <CategoryRounded />,
    path: '/genres/:id/edit',
    component: GenresForm,
    exact: true,
  },
  // Gêneros
  {
    name: 'videos.list',
    label: 'Vídeos',
    icon: <VideocamRounded />,
    path: '/videos',
    component: VideosList,
    exact: true,
  },
  {
    name: 'videos.create',
    label: 'Adicionar vídeos',
    icon: <VideocamRounded />,
    path: '/videos/create',
    component: VideosForm,
    exact: true,
  },
  {
    name: 'videos.edit',
    label: 'Editar vídeos',
    icon: <VideocamRounded />,
    path: '/videos/:id/edit',
    component: VideosForm,
    exact: true,
  },
];

export default routes;
