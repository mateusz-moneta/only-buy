import React from 'react';

import { FilesUploader, LabeledInput, LabeledSelect, PrimaryButton } from '../../components';

const Register = () => {
  const handleChange = () => {
    console.log('');
  };

  const handleSubmit = () => {
    console.log('');
  };

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
            minLength={5}
            name="username"
            type="text"
            placeholder="Enter username"
            required={true}
          />

          <FilesUploader accept=".jpg, .jpeg, .png" />

          <LabeledInput
            change={handleChange}
            minLength={5}
            name="email"
            type="email"
            placeholder="Enter e-mail"
            required={true}
          />

          <LabeledInput
            change={handleChange}
            name="password"
            placeholder="Enter password"
            required={true}
            type="password"
          />

          <LabeledInput
            change={handleChange}
            name="password"
            placeholder="Repeat password"
            required={true}
            type="password"
          />

          <LabeledSelect label="Role" name="role" />

          <PrimaryButton click={handleSubmit} name="Create" disabled={true} />
        </form>
      </div>
    </div>
  );
};

export default Register;
