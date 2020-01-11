import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import { Form as UnForm } from '@rocketseat/unform';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import RadioButton from '~/components/RadioButton';
import history from '~/util/history';
import castMemberHttp from '~/util/http/castMember-http';

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
  const [castMember, setCastMember] = useState({
    name: '',
    type: '',
  });

  const [formType, setFormType] = useState('save');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function loadCastMember() {
      const response = await castMemberHttp.get(id);
      setCastMember(response.data.data);
      setLoading(false);
    }

    loadCastMember();
  }, [id]);

  function handleSubmit(data) {
    setLoading(true);
    const http = !id
      ? castMemberHttp.create(data)
      : castMemberHttp.update(id, data);

    http
      .then(response => {
        setLoading(false);
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
        setLoading(false);
      });
  }

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} membro de elenco</h1>
      <UnForm schema={schema} onSubmit={handleSubmit} initialData={castMember}>
        <InputButton label="Nome" name="name" isLoading={isLoading} />
        <RadioButton
          label="Tipo"
          name="type"
          list={CastMembersTypeMap}
          isLoading={isLoading}
        />
        <FormButtons setFormType={setFormType} isLoading={isLoading} />
      </UnForm>
    </>
  );
}
