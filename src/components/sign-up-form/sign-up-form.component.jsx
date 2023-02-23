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

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [displayNameError, setDisplayNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState({
    displayName: '',
    email: '',
    message: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { displayName, email, password, confirmPassword } = formFields;

  const validateForm = useCallback(() => {
    let isValid = false;
    const formValidation = {
      displayNameValid: false,
      emailValid: false,
      passwordValid: false,
      confirmPasswordValid: false,
      samePasswords: false,
    };
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (displayName.length >= 2) {
      setDisplayNameError('');
      formValidation.displayNameValid = true;
    } else if (displayName.length > 0 && displayName.length < 2) {
      setDisplayNameError('Display name must be 2 or more characters.');
      formValidation.displayNameValid = false;
    }
    if (email.match(emailRegex)) {
      setEmailError('');
      formValidation.emailValid = true;
    } else if (email.length > 10 && !email.match(emailRegex)) {
      setEmailError('Invalid email: Must be in form of name@example.com');
      formValidation.emailValid = false;
    }
    if (
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    ) {
      setPasswordError('');
      formValidation.passwordValid = true;
      formValidation.confirmPasswordValid = true;
      formValidation.samePasswords = true;
    } else if (
      password.length > 2 &&
      password.length < 6 &&
      confirmPassword.length > 2
    ) {
      setPasswordError('Password must be at least 6 characters.');
      formValidation.passwordValid = false;
    } else if (confirmPassword.length > 2 && confirmPassword.length < 6) {
      setPasswordError('Confirm Password must be at least 6 characters.');
      formValidation.confirmPasswordValid = false;
      formValidation.samePasswords = false;
    } else if (
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password !== confirmPassword
    ) {
      setPasswordError('Passwords must match.');
      formValidation.confirmPasswordValid = false;
      formValidation.samePasswords = false;
    }

    isValid = Object.values(formValidation).every(item => item === true);

    return isValid;
  }, [displayName, email, password, confirmPassword]);

  const resetForm = () => {
    setFormFields(defaultFormFields);
    setIsFormValid(false);
  };

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

      await createUserDocumentFromAuth({ ...user, displayName });
      setFormSuccess({
        displayName: displayName,
        email: email,
        message: 'Successfully registered!',
      });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setFormError('User email is already registered.');
      } else {
        setFormError('Unable to comlete sign up with email and password.');
      }
    } finally {
      resetForm();
    }
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [validateForm, isFormValid]);

  return (
    <div className='sign-up-container'>
      <h2>Don't have anaccount?</h2>
      <span>Sign Up with Email and Password</span>
      <form method='post' onSubmit={handleSubmit}>
        <FormInput
          htmlFor='displayName'
          label='Display Name'
          type='text'
          name='displayName'
          value={displayName}
          onChange={handleChange}
          min='2'
          required
        />
        <FormInput
          htmlFor='email'
          label='Email'
          type='email'
          name='email'
          onChange={handleChange}
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
          min='6'
          required
        />
        <Button type='submit' disabled={!isFormValid}>
          Sign Up
        </Button>
        {displayNameError || emailError || passwordError ? (
          <div className='warning'>
            <span className='error'>
              {displayNameError || emailError || passwordError}
            </span>
          </div>
        ) : null}
        {formError ? (
          <div className='warning'>
            <span className='error'>{formError}</span>
            <span className='dismiss' onClick={() => setFormError('')}>
              X
            </span>
          </div>
        ) : null}
        {formSuccess.message ? (
          <div className='success' onClick={() => setFormSuccess('')}>
            <div className='success-container'>
              <span>User: {formSuccess.displayName}</span>
              <br />
              <span>Email: {formSuccess.email}</span>
              <br />
              <span className='green-text'>{formSuccess.message}</span>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
};

export default SignUpForm;
