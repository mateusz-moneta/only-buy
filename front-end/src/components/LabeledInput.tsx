import React from 'react';

export const LabeledInput = ({
  minLength,
  name,
  placeholder,
  required = false,
  type = 'text'
}: {
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
        minLength={minLength}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
};
