import React from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material';

const TextInput: React.FC<{
  name: string;
  label: string;
  type: string
}> = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  let isError = !!meta?.touched && !!meta.error;

  const config = {
    ...field,
    ...otherProps,
    error: isError,
    helperText: isError ? meta.error : '',
    fullWidth: true,
  };

  return <TextField {...config} variant="outlined" />;
};

export default TextInput;
