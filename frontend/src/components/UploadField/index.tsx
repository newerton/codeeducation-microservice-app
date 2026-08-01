import { Button, FormControl } from '@material-ui/core';
import type { FormControlProps } from '@material-ui/core/FormControl';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import type React from 'react';
import {
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import InputFile, { type InputFileComponent } from '../InputFile';

interface UploadFieldProps extends React.RefAttributes<UploadFieldComponent> {
  accept: string;
  label: string;
  setValue: (value) => void;
  error?: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface UploadFieldComponent {
  clear: () => void;
}

const UploadField = forwardRef<UploadFieldComponent, UploadFieldProps>(
  (props, ref) => {
    const fileRef = useRef() as MutableRefObject<InputFileComponent>;
    const { accept, label, setValue, error, disabled } = props;

    useImperativeHandle(ref, () => ({
      clear: () => fileRef.current.clear(),
    }));

    return (
      <FormControl
        error={error !== undefined}
        disabled={disabled === true}
        fullWidth
        margin="normal"
        {...props.FormControlProps}
      >
        <InputFile
          ref={fileRef}
          TextFieldProps={{
            label: label,
            InputLabelProps: { shrink: true },
            style: { backgroundColor: '#ffffff', width: '100%' },
          }}
          InputFileProps={{
            accept,
            onChange(event) {
              const files = event.target.files as any;
              files.length && setValue(files[0]);
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
  },
);

export default UploadField;
