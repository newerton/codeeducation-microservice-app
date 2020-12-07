import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { useHistory, useParams } from 'react-router';

import * as Yup from 'yup';
import castMemberHttp from '../../../util/http/cast-member-http';
import { CastMember } from '../../../util/models';
import DefaultForm from '../../../components/DefaultForm';

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import FormButtons from '../../../components/FormButtons';
import LoadingContext from '../../../components/Loading/LoadingContext';

const schema = Yup.object().shape({
  name: Yup.string().label('Nome').required().max(255),
  type: Yup.number().label('Tipo').required(),
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
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const [formType, setFormType] = useState<string>('save');
  const loading = useContext(LoadingContext);

  useEffect(() => {
    register({ name: 'type' });
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isSubscribed = true;
    async function loadCastMember() {
      try {
        const { data } = await castMemberHttp.get(id);
        if (isSubscribed) {
          setCastMember(data.data);
          reset(data.data);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Não foi possível carregar as informações.', {
          variant: 'error',
        });
      }
    }

    loadCastMember();

    return () => {
      isSubscribed = false;
    };
  }, [id, reset, enqueueSnackbar]);

  const handleChange = (event) =>
    setValue('type', parseInt(event.target.value));

  const onSubmit = async (formData, event) => {
    try {
      const http = !castMember
        ? castMemberHttp.create(formData)
        : castMemberHttp.update(castMember.id, formData);
      const { data } = await http;

      enqueueSnackbar('Membro de elenco salvo com sucesso!', {
        variant: 'success',
      });

      setTimeout(() => {
        if (formType === 'save') {
          history.push('/cast-members');
        }
        if (formType === 'save-and-new') {
          history.push('/cast-members/create');
        }
        if (formType === 'save-and-edit') {
          const castMemberId = data.data.id;
          const urlRedirect = `/categories/${castMemberId}/edit`;
          if (id) {
            history.replace(urlRedirect);
          } else {
            history.push(urlRedirect);
          }
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível salvar o membro de elenco :(', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} membro de elenco</h1>
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
        <FormControl
          margin="normal"
          error={errors.type !== undefined}
          disabled={loading}
        >
          <FormLabel component="legend">Tipo</FormLabel>
          <RadioGroup
            defaultValue="1"
            aria-label="type"
            name="type"
            onChange={handleChange}
            value={watch('type') + ''}
          >
            <FormControlLabel value="1" label="Diretor" control={<Radio />} />
            <FormControlLabel value="2" label="Ator" control={<Radio />} />
          </RadioGroup>
          {errors.type && (
            <FormHelperText id="type-helper-text">
              {errors.type.message}
            </FormHelperText>
          )}
        </FormControl>

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
