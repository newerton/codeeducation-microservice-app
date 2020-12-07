import React, { MutableRefObject, useCallback, useImperativeHandle } from 'react';
import AsyncAutocomplete, {
  AsyncAutocompleteComponent,
} from '../../../../components/AsyncAutocomplete';
import GridSelected from '../../../../components/GridSelected';
import GridSelectedItem from '../../../../components/GridSelectedItem';
import {
  Typography,
  FormControl,
  FormControlProps,
  FormHelperText,
} from '@material-ui/core';
import useHttpHandled from '../../../../hooks/useHttpHandled';
import useCollectionManager from '../../../../hooks/useCollectionManager';
import castMemberHttp from '../../../../util/http/cast-member-http';

interface CastMemberFieldProps
  extends React.RefAttributes<CastMemberFieldComponent> {
  castMembers: any[];
  setCastMembers: (castMembers) => void;
  error: any;
  disabled?: boolean;
  FormControlProps?: FormControlProps;
}

export interface CastMemberFieldComponent {
  clear: () => void;
}

const CastMemberField = React.forwardRef<
  CastMemberFieldComponent,
  CastMemberFieldProps
>((props, ref) => {
  const autocompleteHttp = useHttpHandled();
  const { castMembers, setCastMembers, error, disabled } = props;
  const { addItem, removeItem } = useCollectionManager(
    castMembers,
    setCastMembers,
  );
  const autocompleteRef = React.useRef() as MutableRefObject<
    AsyncAutocompleteComponent
  >;

  const fetchOptions = useCallback(
    (searchText) => {
      return autocompleteHttp(
        castMemberHttp.list({
          queryParams: {
            search: searchText,
            all: '',
          },
        }),
      ).then((data) => data.data);
    },
    [autocompleteHttp],
  );

  useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear(),
  }));

  return (
    <>
      <AsyncAutocomplete
        ref={autocompleteRef}
        AutocompleteProps={{
          clearOnEscape: true,
          freeSolo: true,
          getOptionLabel: (option) => option.name,
          getOptionSelected: (option, value) => option.id === value.id,
          onChange: (event, value) => addItem(value),
          disabled,
        }}
        fetchOptions={fetchOptions}
        TextFieldProps={{
          label: 'Elenco',
          error: error !== undefined,
        }}
      />
      <FormControl
        margin="normal"
        fullWidth
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        <GridSelected>
          {castMembers.map((castMember, key) => (
            <GridSelectedItem
              key={key}
              onDelete={() => {
                removeItem(castMember);
              }}
              xs={6}
            >
              <Typography noWrap={true}> {castMember.name} </Typography>
            </GridSelectedItem>
          ))}
        </GridSelected>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    </>
  );
});

export default CastMemberField;
