import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { LabeledInput, PrimaryButton } from '../../components';

const Login = () => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const handleSubmit = () => {
    console.log('');
  };

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
            minLength={5}
            name="username"
            type="text"
            placeholder="Enter username"
            required={true}
          />

          <LabeledInput
            change={handleChange}
            minLength={5}
            name="password"
            placeholder="Enter password"
            required={true}
            type="password"
          />

          <PrimaryButton click={handleSubmit} name="Log In" disabled={true} />
        </form>

        <div className="col-sm-12">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
