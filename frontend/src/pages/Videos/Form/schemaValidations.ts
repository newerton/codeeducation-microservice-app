import * as Yup from 'yup';

// import {
//   SUPPORTED_FORMATS_IMAGES,
//   SUPPORTED_FORMATS_VIDEOS,
// } from '~/util/models';
//
// const thumbFile = Yup.string().required();
// const bannerFile = Yup.string().required();
// const trailerFile = Yup.string().required();
// const videoFile = Yup.string().required();

export const schemaValidations = Yup.object().shape({
  title: Yup.string().max(255).required('O título é obrigatório'),
  description: Yup.string().required('A descrição é obrigatório'),
  year_launched: Yup.string()
    .min(2)
    .max(4)
    .required('O ano de lançamento é obrigatório'),
  duration: Yup.string().min(2).max(3).required('A duração é obrigatório'),
  rating: Yup.string().required('A classificação é obrigatório'),
  genres: Yup.string()
    .test(
      'notEmpty',
      'O gênero é obrigatório',
      async (value: any) => value && value.length > 2, // retornar 2 colchete como string
    )
    .test({
      name: 'emptyCategory',
      message:
        'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
      test(value) {
        const json = JSON.parse(value);
        const parentCategories = JSON.parse(this.parent.categories);
        return json.every(
          (v) =>
            v.categories.filter((cat) =>
              parentCategories.map((c) => c.id).includes(cat.id),
            ).length !== 0,
        );
      },
    })
    .required('O gênero é obrigatório'),
  categories: Yup.string()
    .test(
      'notEmpty',
      'A categoria é obrigatório',
      async (value: any) => value && value.length > 2, // retornar 2 colchete como string
    )
    .required('A categoria é obrigatório'),
  cast_members: Yup.string()
    .test(
      'notEmpty',
      'O membros de elencos é obrigatório',
      async (value: any) => value && value.length > 2, // retornar 2 colchete como string
    )
    .required('A categoria é obrigatório'),
  opened: Yup.bool(),
  // thumb_file: Yup.string()
  //   .test('fileFormat', 'Formato de imagem não suportado', async value => {
  //     const type = value.split(';')[0].split(':')[1];
  //     return (
  //       value &&
  //       (await thumbFile.isValid(value)) &&
  //       SUPPORTED_FORMATS_IMAGES.includes(type)
  //     );
  //   })
  //   .required('O Thumbnail é obrigatório'),
  // banner_file: Yup.string()
  //   .test('fileFormat', 'Formato de imagem não suportado', async value => {
  //     const type = value.split(';')[0].split(':')[1];
  //     return (
  //       value &&
  //       (await bannerFile.isValid(value)) &&
  //       SUPPORTED_FORMATS_IMAGES.includes(type)
  //     );
  //   })
  //   .required('O Banner é obrigatório'),
  // trailer_file: Yup.string()
  //   .test('fileFormat', 'Formato de vídeo não suportado', async value => {
  //     const type = value.split(';')[0].split(':')[1];
  //     return (
  //       value &&
  //       (await trailerFile.isValid(value)) &&
  //       SUPPORTED_FORMATS_VIDEOS.includes(type)
  //     );
  //   })
  //   .required('O Trailer é obrigatório'),
  // video_file: Yup.string()
  //   .test('fileFormat', 'Formato de vídeo não suportado', async value => {
  //     const type = value.split(';')[0].split(':')[1];
  //     return (
  //       value &&
  //       (await videoFile.isValid(value)) &&
  //       SUPPORTED_FORMATS_VIDEOS.includes(type)
  //     );
  //   })
  //   .required('O Vídeo principal é obrigatório'),
});
