import React, { useRef, useState } from 'react';

import { Button, FormControl } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PropTypes from 'prop-types';

import InputFile from '~/components/InputFile';
import { toBase64 } from '~/util/helpers';

export default function UploadField({
  accept,
  label,
  name,
  isLoading,
  ...rest
}) {
  const fileRef = useRef(null);
  const [values, setValues] = useState('');

  return (
    <FormControl
      disabled={isLoading}
      margin="normal"
      fullWidth
      {...rest.FormControlProps}
    >
      <InputFile
        ref={fileRef}
        name={name}
        values={values}
        setValues={setValues}
        TextFieldProps={{
          label,
          InputLabelProps: { shrink: true },
          style: { backgroundColor: '#ffffff' },
        }}
        InputFileProps={{
          accept,
          async onChange(event) {
            const { files } = event.target;
            if (files.length) {
              setValues(await toBase64(files[0]));
            }
          },
        }}
        ButtonFile={
          <Button
            endIcon={<CloudUploadIcon />}
            variant="contained"
            color="primary"
            onClick={() => fileRef.current.openWindow()}
          >
            Adicionar
          </Button>
        }
      />
    </FormControl>
  );
}

UploadField.propTypes = {
  accept: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

UploadField.defaultProps = {
  isLoading: false,
};
