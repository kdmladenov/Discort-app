import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const CheckboxInput: React.FC<{
  name: string;
  label: string;
  legend: string;
}> = ({ name, label, legend }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFieldValue(name, checked);
  };

  const config = {
    ...field,
    error: !!meta?.touched && !!meta?.error,
    onChange: handleChange
  };

  return (
    <FormControl>
      <FormLabel component="legend">{legend}</FormLabel>
      <FormGroup>
        <FormControlLabel control={<Checkbox {...config} />} label={label} />
      </FormGroup>
    </FormControl>
  );
};

export default CheckboxInput;
