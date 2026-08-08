import React, { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertContext } from '../../../contexts';
import { apiUrl } from '../../../api';
import { Button, FilesUploader, LabeledInput } from '../../../components';
import { request } from '../../../utils';

import './Register.scss';
import { Input } from '../../../models';

const initialInputsState: Input = {
  avatar: {
    value: null,
    valid: false,
    nullable: true
  },
  username: {
    value: '',
    valid: false
  },
  email: {
    value: '',
    valid: false
  },
  password: {
    value: '',
    valid: false
  },
  repeatPassword: {
    value: '',
    valid: false
  }
};

const Register = () => {
  const alertContext = useContext(AlertContext);

  const navigate = useNavigate();

  const [forceDisabled, setForceDisabled] = useState(false);
  const [inputs, setInputs] = useState(initialInputsState);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForceDisabled(false);

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
    request(`${apiUrl}/auth/register`, {
      username: inputs.username.value,
      password: inputs.password.value,
      email: inputs.email.value
    })
      .then((response) => response.json())
      .then((result: boolean) => {
        if (!result) {
          setForceDisabled(true);
          alertContext.writeMessage('User has not been registered.');
          alertContext.open();

          setTimeout(() => {
            alertContext.close();
            alertContext.cleanMessage();
          }, 3000);

          return;
        }

        navigate('/login');
      });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
          <header>
            <h1>Register</h1>
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

            <FilesUploader change={handleChange} accept=".jpg, .jpeg, .png" name="image" />

            <LabeledInput
              change={handleChange}
              label="E-mail"
              minLength={5}
              name="email"
              type="email"
              placeholder="Enter e-mail"
              required={true}
            />

            <LabeledInput
              change={handleChange}
              label="Password"
              name="password"
              placeholder="Enter password"
              required={true}
              type="password"
            />

            <LabeledInput
              change={handleChange}
              label="Repeat password"
              name="repeatPassword"
              placeholder="Repeat password"
              required={true}
              type="password"
            />

            <Button
              click={handleSubmit}
              disabled={
                Object.values(inputs)
                  .filter((input) => !input?.nullable)
                  .some(({ valid }) => !valid) ||
                inputs.password.value !== inputs.repeatPassword.value ||
                forceDisabled
              }
              theme="primary"
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
