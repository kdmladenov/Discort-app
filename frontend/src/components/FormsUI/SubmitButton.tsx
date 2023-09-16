import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@mui/material';

const SubmitButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { submitForm, isSubmitting, isValid } = useFormikContext();

  return (
    <Button
      onClick={() => {
        submitForm();
      }}
      disabled={isSubmitting || !isValid}
      fullWidth={true}
      color="primary"
      variant="contained"
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
