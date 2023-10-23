import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { Dispatch } from 'redux';

import { LabeledInput, PrimaryButton } from '../../components';
import { loginUser } from '../../state';
import { LoginRequestPayload } from '../../state/auth/models';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: false
    }
  });
  const dispatch: Dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      validity: { valid }
    } = event.target;

    setInputs((values) => ({
      ...values,
      [name]: {
        value,
        valid
      }
    }));
  };

  const handleSubmit = () =>
    dispatch(
      loginUser({
        username: inputs.username.value
      } as LoginRequestPayload)
    );

  return (
    <div className="row h-100">
      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <header>
          <h1>Login</h1>
        </header>
      </div>

      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <form>
          <LabeledInput
            change={handleChange}
            label="Username"
            minLength={5}
            name="username"
            type="text"
            placeholder="Enter username"
            required={true}
          />

          <LabeledInput
            autoComplete="on"
            change={handleChange}
            label="Password"
            minLength={8}
            name="password"
            placeholder="Enter password"
            required={true}
            type="password"
          />

          <PrimaryButton
            click={handleSubmit}
            disabled={Object.values(inputs).some(({ valid }) => !valid)}
            name="Log In"
          />
        </form>

        <div className="col-sm-12">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
