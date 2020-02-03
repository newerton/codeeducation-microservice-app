import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Form as UnForm } from '@rocketseat/unform';

import FormButtons from '~/components/FormButtons';
import InputButton from '~/components/InputButton';
import SwitchButton from '~/components/SwitchButton';
import UploadField from '~/components/UploadField';
import RatingField from '~/pages/Videos/Form/RatingFields';
import { schemaValidations } from '~/pages/Videos/Form/schemaValidations';
import history from '~/util/history';
import videoHttp from '~/util/http/video-http';
import { toast } from "react-toastify";

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
  });

  const [formType, setFormType] = useState('save');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    async function loadVideo() {
      const response = await videoHttp.get(id);
      if (isSubscribed) {
        setVideo(response.data.data);
        setLoading(false);
      }
    }

    loadVideo();
    return () => {
      isSubscribed = false;
    };
  }, [id]);

  function handleSubmit(data) {
    setLoading(true);
    const http = !id ? videoHttp.create(data) : videoHttp.update(id, data);

    http
      .then(response => {
        setLoading(false);
        toast.success(`Vídeo ${id ? 'editado' : 'cadastrado'} com sucesso!`);
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
        setLoading(false);
      });
  }

  return (
    <>
      <h1>{!id ? 'Adicionar um novo' : 'Editar'} vídeo</h1>
      <UnForm
        schema={schemaValidations}
        onSubmit={handleSubmit}
        initialData={video}
      >
        <Grid container spacing={3}>
          <Grid item sm={12} md={6}>
            <InputButton label="Título" name="title" isLoading={isLoading} />
            <InputButton
              label="Sinopse"
              name="description"
              rows="6"
              margin="normal"
              multiline
              isLoading={isLoading}
            />
            <Grid container spacing={3}>
              <Grid item sm={12} md={6}>
                <InputButton
                  label="Ano de lançamento"
                  name="year_launched"
                  type="number"
                  margin="normal"
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <InputButton
                  label="Duração"
                  name="duration"
                  type="number"
                  margin="normal"
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
            <SwitchButton
              name="opened"
              label="Quero que esse conteúdo apareça na seção de Lançamentos"
              isLoading={isLoading}
            />
            <RatingField name="rating" isLoading={isLoading} />
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

        <FormButtons setFormType={setFormType} isLoading={isLoading} />
      </UnForm>
    </>
  );
}
