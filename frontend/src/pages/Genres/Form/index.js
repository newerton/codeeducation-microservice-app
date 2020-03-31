import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Form as UnForm } from '@unform/web';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import SelectButton from '~/components/SelectButton';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';
import genreHttp from '~/util/http/genre-http';
import toast from '~/util/toast';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  categories_id: Yup.array().required('A categoria é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const { id } = useParams();
  const formRef = useRef(null);
  const [formType, setFormType] = useState('save');
  const [categories, setCategories] = useState([]);
  const [genre, setGenre] = useState({
    name: '',
    categories_id: [],
    is_active: false,
  });
  const loading = useContext(LoadingContext);

  useEffect(() => {
    let isSubscribed = true;

    async function loadCategories() {
      const response = await categoryHttp.list({ queryParams: { all: '' } });
      if (isSubscribed) {
        setCategories(response.data.data);
      }
    }

    loadCategories();
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
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

    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  async function handleSubmit(data) {
    try {
      // Remove all previous errors
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      const http = !id
        ? await genreHttp.create(data)
        : await genreHttp.update(id, data);

      http
        .then(response => {
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
        });
    } catch (err) {
      const validationErrors = {};
      if (err instanceof Yup.ValidationError) {
        toast.error(
          'Formulário inválido. Reveja os campos marcados de vermelho'
        );
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  }

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} gênero</h1>
      <UnForm ref={formRef} onSubmit={handleSubmit} initialData={genre}>
        <InputButton label="Nome" name="name" loading={loading} />
        <SelectButton
          label="Categorias"
          list={categories}
          name="categories_id"
          multiple
          loading={loading}
        />
        <SwitchButton name="is_active" label="Ativo?" loading={loading} />
        <FormButtons setFormType={setFormType} loading={loading} />
      </UnForm>
    </>
  );
}
