import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Form as UnForm } from '@unform/web';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import RadioButton from '~/components/RadioButton';
import history from '~/util/history';
import castMemberHttp from '~/util/http/castMember-http';
import toast from '~/util/toast';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  type: Yup.string().required('O tipo é obrigatório'),
});

const CastMembersTypeMap = {
  1: 'Diretor',
  2: 'Autor',
};

export default function Form() {
  const { id } = useParams();
  const formRef = useRef(null);
  const [castMember, setCastMember] = useState({
    name: '',
    type: '',
  });

  const [formType, setFormType] = useState('save');
  const loading = useContext(LoadingContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isSubscribed = true;

    async function loadCastMember() {
      const response = await castMemberHttp.get(id);
      if (isSubscribed) {
        setCastMember(response.data.data);
      }
    }

    loadCastMember();
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
        ? await castMemberHttp.create(data)
        : await castMemberHttp.update(id, data);
      http
        .then(response => {
          toast.success(
            `Membro de elenco ${id ? 'editado' : 'cadastrado'} com sucesso!`
          );
          if (formType === 'save') {
            history.push('/cast-members');
          }
          if (formType === 'save-and-new') {
            history.push('/cast-members/create');
          }
          if (formType === 'save-and-edit') {
            const castMemberId = response.data.data.id;
            const urlRedirect = `/categories/${castMemberId}/edit`;
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
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} membro de elenco</h1>
      <UnForm ref={formRef} onSubmit={handleSubmit} initialData={castMember}>
        <InputButton label="Nome" name="name" loading={loading} />
        <RadioButton
          label="Tipo"
          name="type"
          list={CastMembersTypeMap}
          loading={loading}
        />
        <FormButtons setFormType={setFormType} loading={loading} />
      </UnForm>
    </>
  );
}
