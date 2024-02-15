import React, { ChangeEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { apiUrl } from '../../../api';
import { Button, LabeledInput } from '../../../components';
import { request } from '../../../utils';
import { Input, User } from '../../../models';
import { UserContext } from '../../../contexts/user-context';

import './Login.scss';

const initialInputsState: Input = {
  username: {
    value: '',
    valid: false
  },
  password: {
    value: '',
    valid: false
  }
};

const Login = () => {
  const userContext = useContext(UserContext);

  const [inputs, setInputs] = useState(initialInputsState);

  const navigate = useNavigate();

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
    request(`${apiUrl}/auth/login`, {
      username: inputs.username.value,
      password: inputs.password.value
    })
      .then((user: User) => userContext.login(user))
      .then(() => navigate('/'));

  return (
    <div className="container">
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

            <Button
              click={handleSubmit}
              disabled={Object.values(inputs).some(({ valid }) => !valid)}
              theme="primary"
            >
              Log In
            </Button>
          </form>

          <div className="col-sm-12">
            <Link className="link" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
