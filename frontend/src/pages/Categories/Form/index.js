import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Form as UnForm } from '@unform/web';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';
import toast from '~/util/toast';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const { id } = useParams();
  const formRef = useRef(null);
  const [category, setCategory] = useState({
    name: '',
    description: '',
    is_active: false,
  });

  const [formType, setFormType] = useState('save');
  const loading = useContext(LoadingContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isSubscribed = true;

    async function loadCategory() {
      const response = await categoryHttp.get(id);
      if (isSubscribed) {
        setCategory(response.data.data);
      }
    }

    loadCategory();
    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});
      await schema.validate(data, {
        abortEarly: false,
      });
      const http = !id
        ? await categoryHttp.create(data)
        : await categoryHttp.update(id, data);
      http
        .then(response => {
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
      <h1>{!id ? 'Adicionar uma nova' : 'Editar'} categoria</h1>
      <UnForm ref={formRef} onSubmit={handleSubmit} initialData={category}>
        <InputButton label="Nome" name="name" loading={loading} />
        <InputButton
          label="Descrição"
          name="description"
          rows="6"
          margin="normal"
          multiline
          loading={loading}
        />
        <SwitchButton name="is_active" label="Ativo?" loading={loading} />
        <FormButtons setFormType={setFormType} loading={loading} />
      </UnForm>
    </>
  );
}
