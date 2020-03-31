import React, { useEffect, useRef, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import AsyncAutoComplete from '~/components/AsyncAutoComplete';
import GridSelected from '~/components/GridSelected';
import GridSelectedItem from '~/components/GridSelectedItem';
import useCollectionManager from '~/hooks/useCollectionManager';
import useHttpHandled from '~/hooks/useHttpHandled';
import genreHttp from '~/util/http/genre-http';
import { getGenresFromCategory } from '~/util/model-filters';

export default function GenreFields({
  name,
  loading,
  genres,
  setGenres,
  categories,
  setCategories,
}) {
  const autocompleteHttp = useHttpHandled();
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);
  const { addItem, removeItem } = useCollectionManager(genres, setGenres);
  const { removeItem: removeCategory } = useCollectionManager(
    categories,
    setCategories
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'dataset.value',
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue) {
      setValues(defaultValue);
      setGenres(defaultValue);
    }
  }, [fieldName, defaultValue, setGenres]);

  useEffect(() => {
    setValues(genres);
  }, [genres]);

  function fetchOptions(searchText) {
    return autocompleteHttp(
      genreHttp.list({
        queryParams: { search: searchText, all: '' },
      })
    ).then(data => data.data);
  }

  return (
    <>
      <AsyncAutoComplete
        fetchOptions={fetchOptions}
        AutocompleteProps={{
          freeSolo: true,
          getOptionLabel: option => option.name,
          onChange: (event, value) => addItem(value),
        }}
        TextFieldProps={{
          name,
          ref,
          label: 'Gêneros',
          id: fieldName,
          value: JSON.stringify(values),
          'data-value': JSON.stringify(values),
          disabled: loading,
          error: error && true,
          helperText: error,
        }}
      />
      {genres.length > 0 && (
        <GridSelected>
          {genres.map(genre => (
            <GridSelectedItem
              key={genre.id}
              onDelete={() => {
                const categoriesWithOneGenre = categories.filter(category => {
                  const genresFromCategory = getGenresFromCategory(
                    genres,
                    category
                  );
                  return (
                    genresFromCategory.length === 1 && genres[0].id === genre.id
                  );
                });
                categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                removeItem(genre);
              }}
              xs={12}
            >
              <Typography noWrap>{genre.name}</Typography>
            </GridSelectedItem>
          ))}
        </GridSelected>
      )}
    </>
  );
}

GenreFields.propTypes = {
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  genres: PropTypes.array.isRequired,
  setGenres: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  categories: PropTypes.array.isRequired,
  setCategories: PropTypes.func.isRequired,
};

GenreFields.defaultProps = {
  loading: false,
};
