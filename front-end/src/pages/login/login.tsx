import React from 'react';
import { Link } from 'react-router-dom';

import { LabeledInput } from "../../components"

const Login = () => {
  return (
    <div className="row">
      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <header>
          <h1>Login</h1>
        </header>
      </div>

      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <form>
          <div>
            <LabeledInput
                minLength={5}
                name="username"
                type="text"
                placeholder="Enter username"
                required={true}
            />
          </div>

          <div>
            <LabeledInput
                minLength={5}
                name="password"
                placeholder="Enter password"
                required={true}
                type="password"
            />
          </div>

          <div>
            <button className="btn btn-primary" id="login__action-button" type="button" disabled>
              Log in
            </button>
          </div>
        </form>

        <div className="col-sm-12">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
