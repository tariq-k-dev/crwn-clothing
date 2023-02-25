import { useState, useEffect, useCallback } from 'react';

import FormInput from '../../components/form-input/form-input.component';
import Button from '../button/button.component';

import './sign-in-form.styles.scss';

import {
  signInWithGooglePopup,
  signInAuthWithEmailAndPassword,
} from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  email: '',
  password: '',
};
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState({
    displayName: '',
    email: '',
    message: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { email, password } = formFields;

  const validateEmail = () => {
    if (!email.match(emailRegex)) {
      setEmailError(true);
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError(true);
    }
  };

  const validateForm = useCallback(() => {
    let isValid = false;
    const formValidation = {
      emailValid: false,
      passwordValid: false,
    };

    if (email.match(emailRegex)) {
      setFormError('');
      setEmailError(false);
      formValidation.emailValid = true;
    } else if (email.length > 8 && !email.match(emailRegex)) {
      setEmailError(true);
      formValidation.emailValid = false;
    }
    if (password.length >= 6) {
      setPasswordError(false);
      formValidation.passwordValid = true;
    } else if (password.length > 2 && password.length < 6) {
      setPasswordError(true);
      formValidation.passwordValid = false;
    }

    isValid = Object.values(formValidation).every(item => item === true);

    return isValid;
  }, [email, password]);

  const resetForm = () => {
    setFormFields(defaultFormFields);
    setIsFormValid(false);
    setEmailError(false);
    setPasswordError(false);
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const signInWithGoogle = async () => {
    setFormError('');
    resetForm();

    const { user } = await signInWithGooglePopup();

    if (user) {
      const { displayName, email } = user;
      setFormSuccess({
        displayName: displayName,
        email: email,
        message: 'Successfully logged in!',
      });
    } else {
      setFormError('*** Unable to sign in ***');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setFormError('');

    const { email, password } = formFields;

    try {
      const user = await signInAuthWithEmailAndPassword(email, password);

      if (user) {
        const { displayName, email } = user;

        setFormSuccess({
          displayName: displayName,
          email: email,
          message: 'Successfully logged in!',
        });
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setFormError('*** Incorrect password for email ***');
          break;
        case 'auth/user-not-found':
          setFormError('*** Not a registered user ***');
          break;
        default:
          console.error(error);
      }
    } finally {
      resetForm();
    }
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm, isFormValid]);

  return (
    <div className='sign-in-container'>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form method='post' onSubmit={handleSubmit}>
        <FormInput
          htmlFor='email'
          label='Email'
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          onBlur={validateEmail}
          required
        />
        <FormInput
          htmlFor='password'
          label='Password'
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          onBlur={validatePassword}
          min='6'
          required
        />
        <div className='buttons-container'>
          <Button type='submit' disabled={!isFormValid}>
            SIGN IN
          </Button>
          <Button type='button' buttonType='google' onClick={signInWithGoogle}>
            SIGN IN WITH GOOGLE
          </Button>
        </div>
        <div className='messages'>
          <div className='warning'>
            {emailError ? (
              <span className='error'>
                &#9888;&ensp;Invalid email. Must be in the form of:
                <br />
                &emsp;&ensp;name@example.com
              </span>
            ) : null}
            {passwordError ? (
              <span className='error'>
                &#9888;&ensp;Password must be at least 6 characters
              </span>
            ) : null}
          </div>
          {formError ? (
            <div className='warning'>
              <p
                className='dismiss'
                style={{ marginTop: '2rem' }}
                onClick={() => setFormError('')}
              >
                X
              </p>
              <p
                className='error'
                style={{ textAlign: 'center', marginTop: '0' }}
              >
                {formError}
              </p>
            </div>
          ) : null}
          {formSuccess.message ? (
            <div
              className='success'
              onClick={() => {
                setFormSuccess('');
                // Temporarily added to remove warnings generated in the signup-form component
                window.location.href = '/auth';
              }}
            >
              <div className='success-container'>
                <span className='green-text'>{formSuccess.message}</span>
                <br />
                <span>User: {formSuccess.displayName}</span>
                <br />
                <span>Email: {formSuccess.email}</span>
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
