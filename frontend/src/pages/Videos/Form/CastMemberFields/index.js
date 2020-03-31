import React, { useEffect, useRef, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import AsyncAutoComplete from '~/components/AsyncAutoComplete';
import GridSelected from '~/components/GridSelected';
import GridSelectedItem from '~/components/GridSelectedItem';
import useCollectionManager from '~/hooks/useCollectionManager';
import useHttpHandled from '~/hooks/useHttpHandled';
import castMemberHttp from '~/util/http/castMember-http';

export default function CastMemberFields({
  name,
  loading,
  castMembers,
  setCastMembers,
}) {
  const autocompleteHttp = useHttpHandled();
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);
  const { addItem, removeItem } = useCollectionManager(
    castMembers,
    setCastMembers
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
      setCastMembers(defaultValue);
    }
  }, [fieldName, defaultValue, setCastMembers]);

  useEffect(() => {
    setValues(castMembers);
  }, [castMembers]);

  function fetchOptions(searchText) {
    return autocompleteHttp(
      castMemberHttp.list({
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
          label: 'Membros de elencos',
          id: fieldName,
          value: JSON.stringify(values),
          'data-value': JSON.stringify(values),
          disabled: loading,
          error: error && true,
          helperText: error,
        }}
      />
      {castMembers.length > 0 && (
        <GridSelected>
          {castMembers.map(genre => (
            <GridSelectedItem
              key={genre.id}
              onDelete={() => removeItem(genre)}
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

CastMemberFields.propTypes = {
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  castMembers: PropTypes.array.isRequired,
  setCastMembers: PropTypes.func.isRequired,
};

CastMemberFields.defaultProps = {
  loading: false,
};
