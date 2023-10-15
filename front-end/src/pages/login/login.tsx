import React from 'react';

const Login = () => {
  return (
    <div className="row content">
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-12">
        <header>
          <h1>Login</h1>
        </header>
      </div>

      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-12">
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
          <a className="login__forgot-password" href="forgot-password">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
