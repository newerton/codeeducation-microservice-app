import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import { Form as UnForm } from '@rocketseat/unform';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const { id } = useParams();
  const [category, setCategory] = useState({
    name: '',
    description: '',
    is_active: false,
  });

  const [formType, setFormType] = useState('save');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function loadCategory() {
      const response = await categoryHttp.get(id);
      setCategory(response.data.data);
      setLoading(false);
    }

    loadCategory();
  }, [id]);

  function handleSubmit(data) {
    setLoading(true);
    const http = !id
      ? categoryHttp.create(data)
      : categoryHttp.update(id, data);

    http
      .then(response => {
        setLoading(false);
        toast.success(
          `Categoria ${id ? 'editada' : 'cadastrada'} com sucesso!`
        );
        if (formType === 'save') {
          history.push('/categories');
        }
        if (formType === 'save-and-new') {
          history.push('/categories/create');
        }
        if (formType === 'save-and-edit') {
          const categoryId = response.data.data.id;
          const urlRedirect = `/categories/${categoryId}/edit`;
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
      <h1>{!id ? 'Adicionar uma nova' : 'Editar'} categoria</h1>
      <UnForm schema={schema} onSubmit={handleSubmit} initialData={category}>
        <InputButton label="Nome" name="name" isLoading={isLoading} />
        <InputButton
          label="Descrição"
          name="description"
          rows="6"
          margin="normal"
          multiline
          isLoading={isLoading}
        />
        <SwitchButton name="is_active" label="Ativo?" isLoading={isLoading} />
        <FormButtons setFormType={setFormType} isLoading={isLoading} />
      </UnForm>
    </>
  );
}
