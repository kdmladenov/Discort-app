import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import useTypedSelector from '../../../hooks/useTypedSelector';
import useTypedDispatch from '../../../hooks/useTypedDispatch';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../slices/auth';
import {
  LOGIN_FORM_TEMPLATE,
  LOGIN_INITIAL_VALUES,
  LOGIN_VALIDATION
} from '../../../constants/forms/login';
import { Container, Grid, Typography } from '@mui/material';
import TextInput from '../../../components/FormsUI/TextInput';
import SubmitButton from '../../../components/FormsUI/SubmitButton';

const Login: React.FC = () => {
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
            initialValues={LOGIN_INITIAL_VALUES}
            validationSchema={LOGIN_VALIDATION}
            onSubmit={(values) => {
              dispatch(login(values));
            }}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>Login</Typography>
                </Grid>
                {LOGIN_FORM_TEMPLATE.map(({ name, label, type }) => (
                  <Grid item xs={12} key={name}>
                    <TextInput name={name} label={label} type={type} />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <SubmitButton>Log in</SubmitButton>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
