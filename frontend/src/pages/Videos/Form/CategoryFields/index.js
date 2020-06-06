import React, { useEffect, useRef, useState, useCallback } from 'react';

import Typography from '@material-ui/core/Typography';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import AsyncAutoComplete from '~/components/AsyncAutoComplete';
import GridSelected from '~/components/GridSelected';
import GridSelectedItem from '~/components/GridSelectedItem';
import useCollectionManager from '~/hooks/useCollectionManager';
import useHttpHandled from '~/hooks/useHttpHandled';
import categoryHttp from '~/util/http/category-http';
import { getGenresFromCategory } from '~/util/model-filters';

export default function CategoryFields({
  name,
  loading,
  genres,
  categories,
  setCategories,
}) {
  const autocompleteHttp = useHttpHandled();
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);
  const { addItem, removeItem } = useCollectionManager(
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
    if (defaultValue.length) {
      setValues(defaultValue);
      setCategories(defaultValue);
    }
  }, [fieldName, defaultValue, setCategories, genres]);

  useEffect(() => {
    setValues(categories);
  }, [categories]);

  const fetchOptions = useCallback(() => {
    if (genres.length > 0) {
      return autocompleteHttp(
        categoryHttp.list({
          queryParams: {
            genres: genres.map(genre => genre.id).join(','),
            all: '',
          },
        })
      ).then(data => data.data);
    }
    return false;
  }, [autocompleteHttp, genres]);

  return (
    <>
      <AsyncAutoComplete
        fetchOptions={fetchOptions}
        AutocompleteProps={{
          getOptionLabel: option => option.name,
          onChange: (event, value) => addItem(value),
          disabled: !genres.length,
        }}
        TextFieldProps={{
          name,
          ref,
          label: 'Categorias',
          id: fieldName,
          value: values,
          'data-value': JSON.stringify(values),
          disabled: loading,
          error: error && true,
          helperText: error,
        }}
      />
      {categories.length > 0 && (
        <GridSelected>
          {categories.map(category => {
            const genresFromCategory = getGenresFromCategory(genres, category)
              .map(genre => genre.name)
              .join(', ');
            return (
              <GridSelectedItem
                key={category.id}
                onDelete={() => removeItem(category)}
                xs={12}
              >
                <Typography noWrap>{category.name}</Typography>
                <Typography variant="caption" noWrap>
                  Gêneros: {genresFromCategory}
                </Typography>
              </GridSelectedItem>
            );
          })}
        </GridSelected>
      )}
    </>
  );
}

CategoryFields.propTypes = {
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  genres: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  categories: PropTypes.array.isRequired,
  setCategories: PropTypes.func.isRequired,
};

CategoryFields.defaultProps = {
  loading: false,
};
