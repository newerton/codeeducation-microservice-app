import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  createRef,
  MutableRefObject,
} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { omit, zipObject } from 'lodash';
import { useSnackbar } from 'notistack';
import FormButtons from '../../../components/FormButtons';
import DefaultForm from '../../../components/DefaultForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { schemaValidations } from './schemaValidations';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import { Video, VideoFileFieldsMaps } from '../../../util/models';
import LoadingContext from '../../../components/Loading/LoadingContext';
import { InputFileComponent } from '../../../components/InputFile';
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField';
import CategoryField, { CategoryFieldComponent } from './CategoryField';
import GenreField, { GenreFieldComponent } from './GenreField';
import videoHttp from '../../../util/http/video-http';
import { Creators } from '../../../store/upload';
import SnackbarUpload from '../../../components/SnackbarUpload';
import { FileInfo } from '../../../store/upload/types';
import RatingField from './RatingField';
import UploadField from '../../../components/UploadField';

const fileFields = Object.keys(VideoFileFieldsMaps);

const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadios: '14px',
    backgroundColor: '#f5f5f5',
    margin: theme.spacing(2, 0),
  },
  cardOpened: {
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
  },
  cardContentOpened: {
    paddingBottom: theme.spacing(2) + 'px !important',
  },
}));

const Form = () => {
  const styles = useStyles();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
    trigger,
    formState,
  } = useForm<{
    title;
    description;
    year_launched;
    duration;
    rating;
    cast_members;
    categories;
    genres;
    opened;
  }>({
    resolver: yupResolver(schemaValidations),
    defaultValues: {
      genres: [],
      categories: [],
      cast_members: [],
      rating: null,
      opened: false,
    },
  });
  useSnackbarFormError(formState.submitCount, errors);

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id }: { id: string } = useParams();
  const [formType, setFormType] = useState<string>('save');

  const [video, setVideo] = useState<Video | null>(null);
  const loading = useContext(LoadingContext);
  const dispatch = useDispatch();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
  const uploadsRef = useRef(
    zipObject(
      fileFields,
      fileFields.map(() => createRef()),
    ),
  ) as MutableRefObject<{
    [key: string]: MutableRefObject<InputFileComponent>;
  }>;
  const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
  const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
  const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;

  const resetForm = useCallback(
    (data) => {
      Object.keys(uploadsRef.current).forEach((field) =>
        uploadsRef.current[field].current.clear(),
      );
      castMemberRef.current && castMemberRef.current.clear();
      categoryRef.current && categoryRef.current.clear();
      genreRef.current && genreRef.current.clear();
      reset(data);
    },
    [castMemberRef, categoryRef, genreRef, reset, uploadsRef],
  );

  useEffect(() => {
    [
      'rating',
      'opened',
      'genres',
      'categories',
      'cast_members',
      ...fileFields,
    ].forEach((name) => register({ name }));
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isSubscribed = true;

    async function loadVideo() {
      try {
        const { data } = await videoHttp.get(id);
        if (isSubscribed) {
          setVideo(data.data);
          reset(data.data);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Não foi possível carregar as informações.', {
          variant: 'error',
        });
      }
    }

    loadVideo();

    return () => {
      isSubscribed = false;
    };
  }, [id, reset, enqueueSnackbar]);

  const uploadFiles = useCallback(
    async (video) => {
      const files: FileInfo[] = fileFields
        .filter((fileField) => getValues()[fileField])
        .map((fileField) => ({ fileField, file: getValues()[fileField] }));
      if (!files.length) {
        return;
      }

      dispatch(Creators.addUpload({ video, files }));

      enqueueSnackbar('', {
        key: 'snackbar-upload',
        persist: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        content: (key, message) => {
          const id = key as any;
          return <SnackbarUpload id={id} />;
        },
      });
    },
    [dispatch, enqueueSnackbar, getValues],
  );

  const onSubmit = async (formData, event) => {
    const sendData = omit(formData, [
      ...fileFields,
      'cast_members',
      'genres',
      'categories',
    ]);
    sendData['cast_members_id'] = formData['cast_members'].map(
      (cast_member) => cast_member.id,
    );
    sendData['categories_id'] = formData['categories'].map(
      (category) => category.id,
    );
    sendData['genres_id'] = formData['genres'].map((genre) => genre.id);

    try {
      const http = !video
        ? videoHttp.create(sendData)
        : videoHttp.update(video.id, sendData);
      const { data } = await http;

      enqueueSnackbar('Vídeo salvo com sucesso!', {
        variant: 'success',
      });
      uploadFiles(data.data);

      id && resetForm(video);

      setTimeout(() => {
        if (formType === 'save') {
          history.push('/videos');
        }
        if (formType === 'save-and-new') {
          history.push('/videos/create');
        }
        if (formType === 'save-and-edit') {
          const videoId = data.data.id;
          const urlRedirect = `/videos/${videoId}/edit`;
          if (id) {
            history.replace(urlRedirect);
          } else {
            history.push(urlRedirect);
          }
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possível salvar o vídeo :(', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} vídeo</h1>
      <DefaultForm
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <TextField
              name="title"
              label="Título"
              fullWidth
              variant="outlined"
              disabled={loading}
              inputRef={register}
              error={errors.title !== undefined}
              helperText={errors.title && errors.title.message}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="description"
              label="Sinopse"
              multiline
              rows="4"
              fullWidth
              variant="outlined"
              disabled={loading}
              margin="normal"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.description !== undefined}
              helperText={errors.description && errors.description.message}
            />

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  name="year_launched"
                  label="Ano de lançamento"
                  type="number"
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputRef={register}
                  error={errors.year_launched !== undefined}
                  helperText={
                    errors.year_launched && errors.year_launched.message
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="duration"
                  label="Duração"
                  type="number"
                  fullWidth
                  variant="outlined"
                  disabled={loading}
                  inputRef={register}
                  error={errors.duration !== undefined}
                  helperText={errors.duration && errors.duration.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <CastMemberField
              castMembers={watch('cast_members')}
              setCastMembers={(value) => setValue('cast_members', value)}
              error={errors.cast_members}
              disabled={loading}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <GenreField
                  genres={watch('genres')}
                  setGenres={(value) => setValue('genres', value)}
                  categories={watch('categories')}
                  setCategories={(value) => setValue('categories', value)}
                  error={errors.genres}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CategoryField
                  categories={watch('categories')}
                  setCategories={(value) => setValue('categories', value)}
                  genres={watch('genres')}
                  error={errors.categories}
                  disabled={loading}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <RatingField
              value={watch('rating')}
              setValue={(value) => setValue('rating', value)}
              error={errors.rating}
              disabled={loading}
              FormControlProps={{
                margin: isGreaterMd ? 'none' : 'normal',
              }}
            />
            <br />
            <Card className={styles.cardUpload}>
              <CardContent>
                <Typography color="primary" variant="h6">
                  Imagens
                </Typography>
                <UploadField
                  ref={uploadsRef.current['thumb_file']}
                  accept="image/*"
                  label="Thumb"
                  setValue={(value) => setValue('thumb_file', value)}
                />
                <UploadField
                  ref={uploadsRef.current['banner_file']}
                  accept="image/*"
                  label="Banner"
                  setValue={(value) => setValue('banner_file', value)}
                />
              </CardContent>
            </Card>
            <Card className={styles.cardUpload}>
              <CardContent>
                <Typography color="primary" variant="h6">
                  Vídeos
                </Typography>
                <UploadField
                  ref={uploadsRef.current['trailer_file']}
                  accept="video/mp4"
                  label="Trailer"
                  setValue={(value) => setValue('trailer_file', value)}
                />
                <UploadField
                  ref={uploadsRef.current['video_file']}
                  accept="video/mp4"
                  label="Principal"
                  setValue={(value) => setValue('video_file', value)}
                />
              </CardContent>
            </Card>
            <br />
            <Card className={styles.cardOpened}>
              <CardContent className={styles.cardContentOpened}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="opened"
                      color="primary"
                      onChange={() =>
                        setValue('opened', !getValues()['opened'])
                      }
                      checked={watch('opened')}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography color="primary" variant="subtitle2">
                      Quero que este conteúdo apareça na seção lançamentos
                    </Typography>
                  }
                  labelPlacement="end"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
