import React, { ChangeEvent } from 'react';

export const LabeledSelect = ({
  change,
  label,
  name
}: {
  change: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  name: string;
}) => {
  return (
    <label htmlFor={name}>
      {label}
      <select onChange={change} name={name}></select>
    </label>
  );
};
