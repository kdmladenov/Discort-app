import React, { useEffect } from 'react';
import { Formik, Form} from 'formik';
import useTypedSelector from '../../../hooks/useTypedSelector';
import useTypedDispatch from '../../../hooks/useTypedDispatch';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../slices/auth';
import {
  REGISTER_FORM_TEMPLATE,
  REGISTER_INITIAL_VALUES,
  REGISTER_VALIDATION
} from '../../../constants/forms/register';
import { Container, Grid, Typography } from '@mui/material';
import TextInput from '../../../components/FormsUI/TextInput';
import SubmitButton from '../../../components/FormsUI/SubmitButton';

const Register: React.FC = () => {
  const { userInfo } = useTypedSelector((state) => state.userLogin);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.token) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Formik
            initialValues={REGISTER_INITIAL_VALUES}
            validationSchema={REGISTER_VALIDATION}
            onSubmit={(values) => {
              dispatch(register(values));
            }}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>Register</Typography>
                </Grid>
                {REGISTER_FORM_TEMPLATE.map(({ name, label, type, width }) => (
                  <Grid item xs={width} key={name}>
                    <TextInput name={name} label={label} type={type} />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <SubmitButton>Register</SubmitButton>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Register;
