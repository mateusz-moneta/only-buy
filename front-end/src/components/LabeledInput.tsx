import React, { ChangeEvent } from 'react';

export const LabeledInput = ({
  change,
  minLength,
  name,
  placeholder,
  required = false,
  type = 'text'
}: {
  change: (event: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  name: string;
  placeholder: string;
  required: boolean;
  type: string;
}) => {
  return (
    <label htmlFor={name}>
      Username
      <input
        onChange={(event) => change(event)}
        minLength={minLength}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
};
