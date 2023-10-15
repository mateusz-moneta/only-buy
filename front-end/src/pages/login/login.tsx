import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="row content">
      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <header>
          <h1>Login</h1>
        </header>
      </div>

      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <form>
          <div>
            <label htmlFor="username">
              Username
              <input
                id="username"
                minLength={5}
                name="username"
                type="text"
                placeholder="Enter username"
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="password">
              Password
              <input
                id="password"
                minLength={6}
                name="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </label>
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
