import { yupResolver } from '@hookform/resolvers';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import * as Yup from 'yup';
import DefaultForm from '../../../components/DefaultForm';
import FormButtons from '../../../components/FormButtons';
import LoadingContext from '../../../components/Loading/LoadingContext';
import categoryHttp from '../../../util/http/category-http';
import type { Category } from '../../../util/models';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  is_active: Yup.bool(),
});

const Form = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      is_active: true,
    },
  });

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [category, setCategory] = React.useState<Category | null>(null);
  const [formType, setFormType] = useState('save');
  const loading = useContext(LoadingContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isSubscribed = true;
    async function loadCategories() {
      try {
        const { data } = await categoryHttp.get(id);
        if (isSubscribed) {
          setCategory(data.data);
          reset(data.data);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Não foi possível carregar as informações.', {
          variant: 'error',
        });
      }
    }

    loadCategories();

    return () => {
      isSubscribed = false;
    };
  }, [id, reset, enqueueSnackbar]);

  React.useEffect(() => {
    register({ name: 'is_active' });
  }, [register]);

  const onSubmit = async (formData, _event) => {
    try {
      const http = !category
        ? categoryHttp.create(formData)
        : categoryHttp.update(category.id, formData);
      const { data } = await http;

      enqueueSnackbar('Categoria salva com sucesso!', {
        variant: 'success',
      });

      setTimeout(() => {
        if (formType === 'save') {
          history.push('/categories');
        }
        if (formType === 'save-and-new') {
          history.push('/categories/create');
        }
        if (formType === 'save-and-edit') {
          const categoryId = data.data.id;
          const urlRedirect = `/categories/${categoryId}/edit`;
          if (id) {
            history.replace(urlRedirect);
          } else {
            history.push(urlRedirect);
          }
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível salvar a categoria :(', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <h1>{!id ? 'Adicionar uma nova' : 'Editar'} categoria</h1>
      <DefaultForm
        GridItemProps={{ xs: 12, md: 6 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          name="name"
          label="Nome"
          fullWidth
          variant="outlined"
          disabled={loading}
          inputRef={register}
          error={errors.name !== undefined}
          helperText={errors.name?.message}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="description"
          label="Descrição"
          multiline
          rows="4"
          fullWidth
          variant="outlined"
          disabled={loading}
          margin="normal"
          inputRef={register}
          InputLabelProps={{ shrink: true }}
        />
        <FormControlLabel
          disabled={loading}
          control={
            <Checkbox
              name="is_active"
              onChange={() => setValue('is_active', !getValues()['is_active'])}
              checked={watch('is_active')}
            />
          }
          label="Ativo?"
          labelPlacement="end"
        />

        <FormButtons
          setFormType={setFormType}
          loading={loading}
          handleSave={() =>
            trigger().then((isValid) => {
              isValid && onSubmit(getValues(), null);
            })
          }
        />
      </DefaultForm>
    </>
  );
};

export default Form;
