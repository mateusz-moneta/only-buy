import React from 'react';

import { FilesUploader } from '../../components';

const Register = () => {
  return (
    <div className="row">
      <div className="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
        <header>
          <h1>Register</h1>
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

          <FilesUploader accept=".jpg, .jpeg, .png" />

          <div>
            <label htmlFor="email">
              E-mail
              <input id="email" name="email" type="email" placeholder="Enter e-mail" required />
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
            <label htmlFor="repeat-password">
              Repeat password
              <input
                id="repeat-password"
                minLength={6}
                name="password"
                type="password"
                placeholder="Repeat password"
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="role">
              Role
              <select name="role" id="role"></select>
            </label>
          </div>

          <div>
            <button
              className="btn btn-primary"
              id="user-creator__action-button"
              type="button"
              disabled
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
