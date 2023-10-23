import React, { ChangeEvent, useState } from 'react';

import { FilesUploader, LabeledInput, LabeledSelect, PrimaryButton } from '../../components';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

const Register = () => {
  const [inputs, setInputs] = useState({
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
    },
    role: {
      value: '',
      valid: false
    }
  });
  const dispatch: Dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = () => console.log(inputs);

  return (
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

          <FilesUploader accept=".jpg, .jpeg, .png" />

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

          <LabeledSelect change={handleChange} label="Role" name="role" />

          <PrimaryButton
            click={handleSubmit}
            disabled={
              Object.values(inputs).some(({ valid }) => !valid) ||
              inputs.password !== inputs.repeatPassword
            }
            name="Create"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
