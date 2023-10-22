import React from 'react';

export const LabeledSelect = ({ label, name }: { label: string; name: string }) => {
  return (
    <label htmlFor={name}>
      {label}
      <select name={name}></select>
    </label>
  );
};
