import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import { Form as UnForm } from '@rocketseat/unform';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import SelectButton from '~/components/SelectButton';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';
import genreHttp from '~/util/http/genre-http';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  categories_id: Yup.array().required('A categoria é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const { id } = useParams();
  const [formType, setFormType] = useState('save');
  const [categories, setCategories] = useState([]);
  const [genre, setGenre] = useState({
    name: '',
    categories_id: [],
    is_active: false,
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    async function loadCategories() {
      const response = await categoryHttp.list({ queryParams: { all: '' } });
      if (isSubscribed) {
        setCategories(response.data.data);
        setLoading(false);
      }
    }

    loadCategories();
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;
    async function loadGenre() {
      const { data } = await genreHttp.get(id);
      const responseData = data.data;
      responseData.categories_id = responseData.categories.map(item => {
        return item.id;
      });
      if (isSubscribed) {
        setGenre(responseData);
      }
    }

    loadGenre();

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  function handleSubmit(data) {
    setLoading(true);
    const http = !id ? genreHttp.create(data) : genreHttp.update(id, data);

    http
      .then(response => {
        setLoading(false);
        toast.success(`Gênero ${id ? 'editado' : 'cadastrado'} com sucesso!`);
        if (formType === 'save') {
          history.push('/genres');
        }
        if (formType === 'save-and-new') {
          history.push('/genres/create');
        }
        if (formType === 'save-and-edit') {
          const genreId = response.data.data.id;
          const urlRedirect = `/genres/${genreId}/edit`;
          if (id) {
            history.replace(urlRedirect);
          } else {
            history.push(urlRedirect);
          }
        }
      })
      .catch(err => {
        const { errors } = err.response.data;
        if (errors) {
          const firstObj = Object.keys(errors)[0];
          toast.error(errors[firstObj][0]);
        }
        setLoading(false);
      });
  }

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} gênero</h1>
      <UnForm schema={schema} onSubmit={handleSubmit} initialData={genre}>
        <InputButton label="Nome" name="name" isLoading={isLoading} />
        <SelectButton
          label="Categorias"
          list={categories}
          name="categories_id"
          multiple
          isLoading={isLoading}
        />
        <SwitchButton name="is_active" label="Ativo?" isLoading={isLoading} />
        <FormButtons setFormType={setFormType} isLoading={isLoading} />
      </UnForm>
    </>
  );
}
