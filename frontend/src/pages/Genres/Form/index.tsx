import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { useHistory, useParams } from 'react-router';

import * as Yup from 'yup';
import DefaultForm from '../../../components/DefaultForm';
import LoadingContext from '../../../components/Loading/LoadingContext';
import { Category, Genre } from '../../../util/models';
import categoryHttp from '../../../util/http/category-http';
import genreHttp from '../../../util/http/genre-http';
import { MenuItem, TextField } from '@material-ui/core';
import FormButtons from '../../../components/FormButtons';

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  categories_id: Yup.array().required('A categoria é obrigatório'),
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
  });

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [formType, setFormType] = useState<string>('save');
  const [categories, setCategories] = useState([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const loading = useContext(LoadingContext);

  const handleChange = (event) => setValue('categories_id', event.target.value);

  useEffect(() => {
    register({ name: 'categories_id' });
  }, [register]);

  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      const promises = [categoryHttp.list()];
      if (id) {
        promises.push(genreHttp.get(id));
      }

      try {
        const [categoryResponse, genreResponse] = await Promise.all(promises);
        if (isSubscribed) {
          setCategories(categoryResponse.data.data);

          if (id) {
            setGenre(genreResponse.data.data);
            reset({
              ...genreResponse.data.data,
              categories_id: genreResponse.data.data.categories.map(
                (category) => category.id,
              ),
            });
          }
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Não foi possível carregar as informações :(', {
          variant: 'error',
        });
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [id, enqueueSnackbar, reset]);

  const onSubmit = async (formData, event) => {
    try {
      const http = !genre
        ? genreHttp.create(formData)
        : genreHttp.update(genre.id, formData);
      const { data } = await http;

      enqueueSnackbar('Gênero salvo com sucesso!', {
        variant: 'success',
      });

      setTimeout(() => {
        if (formType === 'save') {
          history.push('/genres');
        }
        if (formType === 'save-and-new') {
          history.push('/genres/create');
        }
        if (formType === 'save-and-edit') {
          const genreId = data.data.id;
          const urlRedirect = `/genres/${genreId}/edit`;
          if (id) {
            history.replace(urlRedirect);
          } else {
            history.push(urlRedirect);
          }
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível salvar o gênero :(', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} gênero</h1>
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
          helperText={errors.name && errors.name.message}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          name="categories_id"
          label="Categorias"
          select
          SelectProps={{
            multiple: true,
          }}
          value={watch('categories_id')}
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={handleChange}
          disabled={loading}
          error={errors.categories_id !== undefined}
          helperText={errors.categories_id && errors.categories_id.message}
          InputLabelProps={{ shrink: true }}
        >
          {categories.map((category: Category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
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
