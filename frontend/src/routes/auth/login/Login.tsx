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
import Header from '../../../components/Header';
import TextInput from '../../../components/FormsUI/TextInput';
import SubmitButton from '../../../components/FormsUI/SubmitButton';

const Login: React.FC = () => {
  const { userInfo, error } = useTypedSelector((state) => state.userLogin);
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
                  <SubmitButton>Submit Form</SubmitButton>
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

// import React, { useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import useTypedSelector from '../../../hooks/useTypedSelector';
// import useTypedDispatch from '../../../hooks/useTypedDispatch';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../../../slices/auth';
// import { loginForm, loginInitialValues, loginShema } from '../../../constants/forms/login';

// const Login: React.FC = () => {
//   const { userInfo, error } = useTypedSelector((state) => state.userLogin);
//   const dispatch = useTypedDispatch();
//   const navigate = useNavigate();

//   const { handleSubmit, handleChange, values, touched, errors, isSubmitting, isValid } = useFormik({
//     initialValues: loginInitialValues,
//     validationSchema: yup.object(loginShema),
//     onSubmit: (values) => {
//       dispatch(login(values));
//     }
//   });

//   useEffect(() => {
//     if (userInfo?.token) {
//       navigate('/');
//     }
//   }, [navigate, userInfo]);

//   return (
//     <div className="login-form">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         {loginForm.map(({ key, label, type, placeholder }) => (
//           <div className="form-group" key={key}>
//             <label htmlFor={key}>{label}:</label>
//             <input
//               type={type}
//               id={key}
//               name={key}
//               value={values[key as keyof typeof values]}
//               placeholder={placeholder}
//               onChange={handleChange}
//             />
//             {touched[key as keyof typeof touched] && errors[key as keyof typeof errors] && (
//               <div className="error">{errors[key as keyof typeof errors]}</div>
//             )}
//           </div>
//         ))}
//         <div className="form-group">
//           <button type="submit" disabled={isSubmitting || !isValid}>
//             Login
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
