import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, makeStyles } from '@material-ui/core';
import { Form as UnForm } from '@rocketseat/unform';
import * as Yup from 'yup';

import InputButton from '~/components/InputButton';
import SelectButton from '~/components/SelectButton';
import SwitchButton from '~/components/SwitchButton';
import history from '~/util/history';
import categoryHttp from '~/util/http/category-http';
import genreHttp from '~/util/http/genre-http';

const useStyles = makeStyles(theme => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  categories_id: Yup.array().required('A categoria é obrigatório'),
  is_active: Yup.bool(),
});

export default function Form() {
  const classes = useStyles();
  const [formType, setFormType] = useState('save');
  const [categories, setCategories] = useState([]);
  const buttonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  useEffect(() => {
    async function loadCategories() {
      const response = await categoryHttp.list();
      setCategories(response.data.data);
    }
    loadCategories();
  }, []);

  function handleSubmit(data, { resetForm }) {
    genreHttp
      .create(data)
      .then(() => {
        toast.success('Gênero cadastrado com sucesso!');
        if (formType === 'save') {
          history.push('/genres');
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
      <h1>Adicionar um novo gênero</h1>
      <UnForm schema={schema} onSubmit={handleSubmit}>
        <InputButton label="Nome" name="name" />
        <SelectButton
          label="Categorias"
          list={categories}
          name="categories_id"
          multiple
        />
        <SwitchButton name="is_active" label="Ativo?" value={false} />
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
            Salvar e adicionar um novo gênero
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
