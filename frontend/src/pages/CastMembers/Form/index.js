import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Button, makeStyles } from '@material-ui/core';
import { Form as UnForm } from '@rocketseat/unform';
import * as Yup from 'yup';

import InputButton from '~/components/InputButton';
import RadioButton from '~/components/RadioButton';
import history from '~/util/history';
import castMemberHttp from '~/util/http/castMember-http';

const useStyles = makeStyles(theme => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  type: Yup.string().required('O tipo é obrigatório'),
});

const CastMembersTypeMap = {
  1: 'Diretor',
  2: 'Autor',
};

export default function Form() {
  const classes = useStyles();
  const [formType, setFormType] = useState('save');
  const buttonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  function handleSubmit(data, { resetForm }) {
    castMemberHttp
      .create(data)
      .then(() => {
        toast.success('Membro de elenco cadastrado com sucesso!');
        if (formType === 'save') {
          history.push('/cast-members');
        }
        if (formType === 'save-and-new') {
          resetForm();
        }
      })
      .catch(err => {
        const { errors } = err.response.data;
        if (errors) {
          const firstObj = Object.keys(errors)[0];
          toast.error(errors[firstObj][0]);
        }
      });
  }

  return (
    <>
      <h1>Adicionar um novo membro de elenco</h1>
      <UnForm schema={schema} onSubmit={handleSubmit}>
        <InputButton label="Nome" name="name" />
        <RadioButton label="Tipo" name="type" list={CastMembersTypeMap} />
        <div>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save')}
          >
            Salvar
          </Button>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save-and-new')}
          >
            Salvar e adicionar um novo membro de elenco
          </Button>
          <Button
            {...buttonProps}
            type="submit"
            onClick={() => setFormType('save-and-edit')}
          >
            Salvar e continuar editando
          </Button>
        </div>
      </UnForm>
    </>
  );
}
