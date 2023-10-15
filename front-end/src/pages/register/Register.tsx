import React from 'react';

import { FilesUploader, LabeledInput, LabeledSelect, PrimaryButton } from '../../components';

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
          <LabeledInput
            minLength={5}
            name="username"
            type="text"
            placeholder="Enter username"
            required={true}
          />

          <FilesUploader accept=".jpg, .jpeg, .png" />

          <LabeledInput
            minLength={5}
            name="email"
            type="email"
            placeholder="Enter e-mail"
            required={true}
          />

          <LabeledInput
            name="password"
            placeholder="Enter password"
            required={true}
            type="password"
          />

          <LabeledInput
            name="password"
            placeholder="Repeat password"
            required={true}
            type="password"
          />

          <LabeledSelect label="Role" name="role" />

          <PrimaryButton name="Create" disabled={true} />
        </form>
      </div>
    </div>
  );
};

export default Register;
