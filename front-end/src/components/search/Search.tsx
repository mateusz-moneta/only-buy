import React from 'react';

import './Checkbox.scss';

export const Search = ({
  change,
  checked = false,
  disabled = false,
  label,
  name
}: {
  change: () => void;
  checked?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
}) => (
  <label className="checkbox">
    <input onChange={change} checked={checked} disabled={disabled} name={name} type="checkbox" />

    {label}
  </label>
);
