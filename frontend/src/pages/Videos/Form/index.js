import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useParams } from 'react-router';

import {
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Form as UnForm } from '@unform/web';
import { omit } from 'lodash';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import LoadingContext from '~/components/Loading/LoadingContext';
import SnackbarUpload from '~/components/SnackbarUpload';
import SwitchButton from '~/components/SwitchButton';
import UploadField from '~/components/UploadField';
import CastMemberFields from '~/pages/Videos/Form/CastMemberFields';
import CategoryFields from '~/pages/Videos/Form/CategoryFields';
import GenreFields from '~/pages/Videos/Form/GenreFields';
import RatingField from '~/pages/Videos/Form/RatingFields';
import { schemaValidations } from '~/pages/Videos/Form/schemaValidations';
import history from '~/util/history';
import videoHttp from '~/util/http/video-http';
import toast from '~/util/toast';

const useStyles = makeStyles(() => ({
  label: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  card: {
    marginBottom: '10px',
  },
  cardTitle: {
    marginBottom: '10px',
  },
}));

export default function Form() {
  const classes = useStyles();
  const { id } = useParams();
  const [video, setVideo] = useState({
    title: '',
    description: '',
    year_launched: '',
    duration: '',
    rating: '',
    opened: false,
    thumb_file: '',
    banner_file: '',
    trailer_file: '',
    video_file: '',
    genres: [],
    categories: [],
    cast_members: [],
  });

  const formRef = useRef(null);
  const [formType, setFormType] = useState('save');
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [castMembers, setCastMembers] = useState([]);
  const loading = useContext(LoadingContext);
  const snackbar = useSnackbar();

  useEffect(() => {
    snackbar.enqueueSnackbar('', {
      key: 'snackbar-upload',
      persist: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      content: key => <SnackbarUpload id={key} />,
    });
    if (!id) {
      return;
    }

    let isSubscribed = true;

    async function loadVideo() {
      const response = await videoHttp.get(id);
      if (isSubscribed) {
        setVideo(response.data.data);
      }
    }

    loadVideo();
    // eslint-disable-next-line consistent-return
    return () => {
      isSubscribed = false;
    };
  }, [id]); // eslint-disable-line

  const handleSubmit = useCallback(
    async data => {
      try {
        // Remove all previous errors
        formRef.current.setErrors({});

        await schemaValidations.validate(data, {
          abortEarly: false,
        });

        const sendData = omit(data, ['cast_members', 'genres', 'categories']);
        sendData.genres_id = JSON.parse(data.genres).map(item => item.id);
        sendData.categories_id = JSON.parse(data.categories).map(
          item => item.id
        );
        sendData.cast_members_id = JSON.parse(data.cast_members).map(
          item => item.id
        );

        const http = !id
          ? await videoHttp.create(sendData)
          : await videoHttp.update(
              id,
              { ...sendData, _method: 'PUT' },
              { request: { usePost: true } }
            );

        http
          .then(response => {
            toast.success(
              `Vídeo ${id ? 'editado' : 'cadastrado'} com sucesso!`
            );
            if (formType === 'save') {
              history.push('/videos');
            }
            if (formType === 'save-and-new') {
              history.push('/videos/create');
            }
            if (formType === 'save-and-edit') {
              const videoId = response.data.data.id;
              const urlRedirect = `/videos/${videoId}/edit`;
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
    },
    [formType, id]
  );

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} vídeo</h1>
      <UnForm ref={formRef} onSubmit={handleSubmit} initialData={video}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={6}>
            <InputButton label="Título" name="title" loading={loading} />
            <InputButton
              label="Sinopse"
              name="description"
              rows="6"
              margin="normal"
              multiline
              loading={loading}
            />
            <Grid container spacing={3}>
              <Grid item sm={12} md={6}>
                <InputButton
                  label="Ano de lançamento"
                  name="year_launched"
                  type="number"
                  margin="normal"
                  loading={loading}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <InputButton
                  label="Duração"
                  name="duration"
                  type="number"
                  margin="normal"
                  loading={loading}
                />
              </Grid>
            </Grid>

            <SwitchButton
              name="opened"
              label="Quero que esse conteúdo apareça na seção de Lançamentos"
              loading={loading}
            />

            <Box>
              <RatingField name="rating" loading={loading} />
            </Box>

            <CastMemberFields
              name="cast_members"
              loading={loading}
              castMembers={castMembers}
              setCastMembers={setCastMembers}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <GenreFields
                  genres={genres}
                  setGenres={setGenres}
                  categories={categories}
                  setCategories={setCategories}
                  name="genres"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CategoryFields
                  genres={genres}
                  name="categories"
                  loading={loading}
                  categories={categories}
                  setCategories={setCategories}
                />
              </Grid>
              <Grid item xs={12}>
                <FormHelperText>Escolha os gêneros do vídeos</FormHelperText>
                <FormHelperText>
                  Escolha pelo menos uma categoria de cada gênero
                </FormHelperText>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography
                  color="primary"
                  variant="h6"
                  className={classes.cardTitle}
                >
                  Imagens
                </Typography>
                <UploadField
                  accept="image/*"
                  label="Thumbnail"
                  name="thumb_file"
                />
                <UploadField
                  accept="image/*"
                  label="Banner"
                  name="banner_file"
                />
              </CardContent>
            </Card>

            <Card className={classes.card}>
              <CardContent>
                <Typography
                  color="primary"
                  variant="h6"
                  className={classes.cardTitle}
                >
                  Vídeos
                </Typography>
                <UploadField
                  accept="video/mp4"
                  label="Trailer"
                  name="trailer_file"
                />
                <UploadField
                  accept="video/mp4"
                  label="Vídeo"
                  name="video_file"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <FormButtons setFormType={setFormType} loading={loading} />
      </UnForm>
    </>
  );
}
