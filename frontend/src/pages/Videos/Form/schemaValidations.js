import * as Yup from 'yup';

import {
  SUPPORTED_FORMATS_IMAGES,
  SUPPORTED_FORMATS_VIDEOS,
} from '~/util/models';

const thumbFile = Yup.string().required();
const bannerFile = Yup.string().required();
const trailerFile = Yup.string().required();
const videoFile = Yup.string().required();

export const schemaValidations = Yup.object().shape({
  title: Yup.string()
    .max(255)
    .required('O título é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  year_launched: Yup.string()
    .min(2)
    .max(4)
    .required('O ano de lançamento é obrigatório'),
  duration: Yup.string()
    .min(2)
    .max(3)
    .required('A duração é obrigatório'),
  rating: Yup.string().required('A classificação é obrigatório'),
  opened: Yup.bool(),
  thumb_file: Yup.string()
    .test(
      'fileFormat',
      'Formato de imagem não suportado',
      async value =>
        value &&
        (await thumbFile.isValid(value)) &&
        SUPPORTED_FORMATS_IMAGES.includes(value.type)
    )
    .required('O Thumbnail é obrigatório'),
  banner_file: Yup.string()
    .test(
      'fileFormat',
      'Formato de imagem não suportado',
      async value =>
        value &&
        (await bannerFile.isValid(value)) &&
        SUPPORTED_FORMATS_IMAGES.includes(value.type)
    )
    .required('O Banner é obrigatório'),
  trailer_file: Yup.string()
    .test(
      'fileFormat',
      'Formato de vídeo não suportado',
      async value =>
        value &&
        (await trailerFile.isValid(value)) &&
        SUPPORTED_FORMATS_VIDEOS.includes(value.type)
    )
    .required('O Trailer é obrigatório'),
  video_file: Yup.string()
    .test(
      'fileFormat',
      'Formato de vídeo não suportado',
      async value =>
        value &&
        (await videoFile.isValid(value)) &&
        SUPPORTED_FORMATS_VIDEOS.includes(value.type)
    )
    .required('O Vídeo principal é obrigatório'),
});
