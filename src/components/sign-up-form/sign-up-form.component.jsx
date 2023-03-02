import { useState, useEffect, useCallback } from 'react';

import FormInput from '../../components/form-input/form-input.component';
import Button from '../button/button.component';

import './sign-up-form.styles.scss';

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [displayNameError, setDisplayNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [samePasswordsError, setSamePasswordsError] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState({
    displayName: '',
    email: '',
    message: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { displayName, email, password, confirmPassword } = formFields;

  const validateDisplayName = () => {
    if (displayName.length < 2) {
      setDisplayNameError(true);
    }
  };

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

  const validateConfirmPassword = () => {
    if (confirmPassword.length < 6) {
      setConfirmPasswordError(true);
    }
  };

  const validateForm = useCallback(() => {
    let isValid = false;
    const formValidation = {
      displayNameValid: false,
      emailValid: false,
      passwordValid: false,
      confirmPasswordValid: false,
      samePasswords: false,
    };

    if (displayName.length >= 2) {
      setDisplayNameError(false);
      formValidation.displayNameValid = true;
    } else if (displayName.length > 0 && displayName.length < 2) {
      setDisplayNameError(true);
      formValidation.displayName = false;
    }
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
    if (confirmPassword.length >= 6) {
      setConfirmPasswordError(false);
      formValidation.confirmPasswordValid = true;
    } else if (confirmPassword.length > 2 && confirmPassword.length < 6) {
      setConfirmPasswordError(true);
      formValidation.confirmPasswordValid = false;
    }
    if (confirmPassword.length >= 6 && password === confirmPassword) {
      setSamePasswordsError(false);
      formValidation.samePasswords = true;
    } else if (confirmPassword.length >= 6 && password !== confirmPassword) {
      setSamePasswordsError(true);
      formValidation.samePasswords = false;
    }

    isValid = Object.values(formValidation).every(item => item === true);

    return isValid;
  }, [displayName, email, password, confirmPassword]);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const { displayName, email, password, confirmPassword } = formFields;

    if (password !== confirmPassword) return;

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth({
        ...user,
        displayName,
      });

      setFormSuccess({
        displayName: displayName,
        email: email,
        message: 'Successfully registered!',
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setFormError('User is already registered');
      } else {
        setFormError('Unable to comlete sign up with email and password');
      }
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormFields(defaultFormFields);
    setIsFormValid(false);
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm, isFormValid]);

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form method='post' onSubmit={handleSubmit}>
        <FormInput
          htmlFor='displayName'
          label='Display Name'
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          onBlur={validateDisplayName}
          min='2'
          required
        />
        <FormInput
          htmlFor='email'
          label='Email'
          type='email'
          name='email'
          onChange={handleChange}
          onBlur={validateEmail}
          value={email}
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
        <FormInput
          htmlFor='confirmPassword'
          label='Confirm Password'
          type='password'
          name='confirmPassword'
          value={confirmPassword}
          onChange={handleChange}
          onBlur={validateConfirmPassword}
          min='6'
          required
        />
        <Button type='submit' disabled={!isFormValid}>
          Sign Up
        </Button>
        <div className='messages'>
          <div className='warning'>
            {displayNameError ? (
              <span className='error'>
                &#9888;&ensp;Display name must be at least 2 characters
              </span>
            ) : null}
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
            {confirmPasswordError ? (
              <span className='error'>
                &#9888;&ensp;Confirm password must be at least 6 characters
              </span>
            ) : null}
            {samePasswordsError ? (
              <span className='error'>&#9888;&ensp;Passwords do not match</span>
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
            <div className='success' onClick={() => setFormSuccess('')}>
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

export default SignUpForm;
