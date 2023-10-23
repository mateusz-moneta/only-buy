import React, { ChangeEvent } from 'react';

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
}) => {
  return (
    <label htmlFor={name}>
      {label}
      <input
        onChange={(event) => change(event)}
        minLength={minLength}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </label>
  );
};
