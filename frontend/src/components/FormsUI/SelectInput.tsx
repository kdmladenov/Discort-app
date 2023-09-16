import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SelectInput: React.FC<{
  name: string;
  options: { [keys: string]: string };
}> = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFieldValue(name, value);
  };

  let isError = !!meta?.touched && !!meta.error;

  const config = {
    ...field,
    ...otherProps,
    error: isError,
    helperText: isError ? meta.error : '',
    select: true,
    fullWidth: true,
    onChange: handleChange
  };

  return (
    <TextField {...config} variant="outlined">
      {Object.keys(options).map((item, pos) => {
        return (
          <MenuItem key={pos} value={item}>
            {options[item]}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectInput;
