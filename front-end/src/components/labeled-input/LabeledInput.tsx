import React, { ChangeEvent } from 'react';

import './LabeledInput.scss';

export const LabeledInput = ({
  autoComplete = 'off',
  change,
  label,
  minLength,
  name,
  placeholder,
  required = false,
  type = 'text'
}: {
  autoComplete?: HTMLInputElement['autocomplete'];
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  minLength?: number;
  name: string;
  placeholder: string;
  required: boolean;
  type: string;
}) => (
  <label className="labeled-input" htmlFor={name}>
    {label}
    <input
      onChange={(event: ChangeEvent<HTMLInputElement>) => change(event)}
      minLength={minLength}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  </label>
);

export default LabeledInput;
